"""Keep only the current CV snapshot after more than five content commits."""
from pathlib import Path
import subprocess

ROOT_MESSAGE = "Current CV website"
SERVICE_MESSAGES = {ROOT_MESSAGE, "Refresh downloadable CV from current website"}
MAX_CHANGES = 5


def git(repo, *args):
    return subprocess.run(
        ["git", *args], cwd=repo, check=True, text=True, capture_output=True
    ).stdout.strip()


def compact_history(repo):
    if git(repo, "branch", "--show-current") != "main":
        raise RuntimeError("History cleanup is restricted to main.")
    if git(repo, "rev-parse", "--is-shallow-repository") != "false":
        raise RuntimeError("Full history is required to count changes.")
    if git(repo, "status", "--porcelain"):
        raise RuntimeError("Commit the current CV files before history cleanup.")

    subjects = git(repo, "log", "--format=%s").splitlines()
    count = sum(subject not in SERVICE_MESSAGES for subject in subjects)
    print(f"Content changes since the last cleanup: {count} / {MAX_CHANGES}")
    if count <= MAX_CHANGES:
        return None

    expected = git(repo, "rev-parse", "HEAD")
    tree = git(repo, "rev-parse", "HEAD^{tree}")
    root = git(repo, "commit-tree", tree, "-m", ROOT_MESSAGE)
    # Refuse to replace main if another change arrived after this checkout.
    git(repo, "push", f"--force-with-lease=refs/heads/main:{expected}",
        "origin", f"{root}:refs/heads/main")
    git(repo, "update-ref", "refs/heads/main", root, expected)
    print(f"History compacted to {root}; the file tree is unchanged.")
    return root


if __name__ == "__main__":
    compact_history(Path(__file__).resolve().parents[1])
