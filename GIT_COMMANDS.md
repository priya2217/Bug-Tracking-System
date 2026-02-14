# Git Commands Reference for BugTrackerAPI

## 1. Repository Setup

```
bash
# Initialize a new Git repository
git init

# Clone an existing repository
git clone <repository-url>

# Check current repository status
git status
```

## 2. Staging & Committing

```
bash
# Add all files to staging
git add .

# Add specific file
git add <filename.cs>

# Commit changes with message
git commit -m "Your commit message"

# Add and commit in one command
git commit -am "Your commit message"
```

## 3. Branching

```
bash
# List all branches
git branch

# Create new branch
git branch <branch-name>

# Switch to branch
git checkout <branch-name>

# Create and switch to new branch
git checkout -b <branch-name>

# Delete branch
git branch -d <branch-name>
```

## 4. Remote Operations

```
bash
# Add remote repository
git remote add origin <repository-url>

# View remote repositories
git remote -v

# Push to remote
git push origin <branch-name>

# Pull from remote
git pull origin <branch-name>

# Push branch to remote
git push -u origin <branch-name>
```

## 5. Viewing History

```
bash
# View commit history
git log

# View commit history with changes
git log -p

# View brief history
git log --oneline

# View current changes
git diff
```

## 6. Undoing Changes

```
bash
# Discard changes in working directory
git checkout -- <filename.cs>

# Unstage a file
git reset HEAD <filename.cs>

# Revert to previous commit
git revert <commit-hash>

# Reset to previous commit (dangerous)
git reset --hard <commit-hash>
```

## 7. Stashing

```
bash
# Save changes temporarily
git stash

# List stashes
git stash list

# Apply stash
git stash apply

# Drop stash
git stash drop
```

## Common Workflow for .NET Projects

```
bash
# Initialize and create initial commit
git init
git add .
git commit -m "Initial commit - BugTrackerAPI"

# Create feature branch
git checkout -b feature/new-feature

# After making changes
git add .
git commit -m "Add new feature"

# Switch to main and merge
git checkout main
git merge feature/new-feature

# Push to remote
git push -u origin main
```

## .NET Specific .gitignore

The .gitignore file should exclude:

- bin/ and obj/ directories
- NuGet packages
- IDE files (vs/, .vs/, \*.user)
- Build outputs
