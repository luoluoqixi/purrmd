#! /usr/bin/env python3
# -*- coding: utf-8 -*-

import codecs
import os
import sys
import argparse
import platform
import json
from pathlib import Path

import utils

COMMIT_MESSAGE = "release:"


def run_build(project_path):
    if platform.system().lower() == "windows":
        utils.subprocess_run(["cmd", "/c", "pnpm", "build"], working_dir=project_path)
    else:
        utils.subprocess_run(["pnpm", "build"], working_dir=project_path)


def run_release(project_path, release_as):
    print("release...")
    if platform.system().lower() == "windows":
        utils.subprocess_run(
            [
                "cmd",
                "/c",
                "pnpm",
                "release",
                "--release-as",
                release_as,
            ],
            working_dir=project_path,
        )
    else:
        utils.subprocess_run(
            ["pnpm", "release", "--release-as", release_as],
            working_dir=project_path,
        )


def run_publish(project_path):
    if platform.system().lower() == "windows":
        utils.subprocess_run(["cmd", "/c", "pnpm", "publish"], working_dir=project_path)
    else:
        utils.subprocess_run(["pnpm", "publish"], working_dir=project_path)


def get_current_version(project_path):
    package_json_path = os.path.join(project_path, "package.json")
    package_json = json.loads(Path(package_json_path).read_text(encoding="utf-8"))
    return package_json["version"]


def git_tag(repo_root, next_version):
    tags = utils.subprocess_check_output(["git", "tag"], working_dir=repo_root)
    if f"v{next_version}" in tags:
        print(f"tag v{next_version} is already exists, delete tag v{next_version}")
        utils.subprocess_check_output(["git", "tag", "-d", f"v{next_version}"], working_dir=repo_root)
    print(f"create tag v{next_version}")
    # git rev-parse HEAD
    head_commit = utils.subprocess_check_output(["git", "rev-parse", f"HEAD"], working_dir=repo_root).strip()
    utils.subprocess_check_output(["git", "tag", f"v{next_version}", head_commit], working_dir=repo_root)


def git_push(repo_root):
    print(f"git push origin HEAD --tags")
    output = utils.subprocess_run(
        ["git", "push", "origin", "HEAD", "--tags"], working_dir=repo_root
    )
    print(f"{output}")


def git_commit(repo_root, next_version):
    utils.subprocess_run(["git", "add", "."], working_dir=repo_root)
    utils.subprocess_run(
        ["git", "commit", "-S", "-m", f"{COMMIT_MESSAGE} {next_version}"],
        working_dir=repo_root,
    )


def git_revert(project_path):
    package_json_path = os.path.join(project_path, "package.json")
    changelog_path = os.path.join(project_path, "CHANGELOG.md")
    utils.subprocess_run(
        ["git", "restore", package_json_path], working_dir=project_path
    )
    utils.subprocess_run(["git", "restore", changelog_path], working_dir=project_path)


def main():
    parser = argparse.ArgumentParser(description='release tools')
    parser.add_argument('--push', required=False, action="store_true", help='git push')
    parser.add_argument(
        "--major",
        required=False,
        action="store_true",
        help="major version",
    )
    parser.add_argument(
        "--minor",
        required=False,
        action="store_true",
        help="minor version",
    )
    parser.add_argument(
        "--patch",
        required=False,
        action="store_true",
        help="patch version",
    )
    args = parser.parse_args()

    # 修复 windows 编码问题
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())
    sys.stderr = codecs.getwriter("utf-8")(sys.stderr.detach())

    repo_root = utils.REPO_ROOT

    print(f"repo root: {repo_root}")

    project_path = os.path.join(repo_root, "packages/core")

    run_build(project_path)

    release_as = "patch"
    if args.major:
        release_as = "major"
    if args.minor:
        release_as = "minor"
    if args.patch:
        release_as = "patch"

    git_revert(project_path)
    run_release(project_path, release_as)
    current_version = get_current_version(project_path)

    print(f"release version: {current_version}")

    if args.push:
        # git 提交
        git_commit(repo_root, current_version)
        # 增加 tag
        git_tag(repo_root, current_version)
        # git push --follow-tags
        git_push(repo_root)
        # pnpm publish
        run_publish(project_path)


if __name__ == '__main__':
    main()
