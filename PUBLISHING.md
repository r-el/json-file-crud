# Publishing Guide

This guide explains how to publish new versions of JsonFileCRUD to npm.

## Prerequisites

1. **npm account**: Make sure you have an npm account and are logged in
   ```bash
   npm login
   ```

2. **npm token**: For GitHub Actions, add your npm token to repository secrets as `NPM_TOKEN`

3. **Repository access**: Make sure you have push access to the GitHub repository

## Publishing Process

### Option 1: Manual Publishing (Recommended for first time)

1. **Update version and changelog:**
   ```bash
   npm version patch    # for bug fixes
   npm version minor    # for new features
   npm version major    # for breaking changes
   ```

2. **Verify everything works:**
   ```bash
   npm test
   npm run examples
   ```

3. **Check what will be published:**
   ```bash
   npm pack --dry-run
   ```

4. **Publish to npm:**
   ```bash
   npm publish
   ```

### Option 2: Automated Publishing via GitHub Releases

1. **Create a new release on GitHub:**
   - Go to the repository on GitHub
   - Click "Releases" → "Create a new release"
   - Tag version: `v1.0.0` (match package.json version)
   - Release title: `Version 1.0.0`
   - Description: Copy from CHANGELOG.md

2. **GitHub Actions will automatically:**
   - Run all tests
   - Run examples
   - Publish to npm (if tests pass)

### Option 3: Using npm version command

```bash
# This will:
# 1. Run tests
# 2. Run examples  
# 3. Update version in package.json
# 4. Create git tag
# 5. Push to GitHub
npm version patch
```

Then create a GitHub release for the new tag to trigger npm publishing.

## Version Guidelines

- **Patch (1.0.X)**: Bug fixes, documentation updates
- **Minor (1.X.0)**: New features, non-breaking changes
- **Major (X.0.0)**: Breaking changes

## Checklist Before Publishing

- [ ] All tests pass (`npm test`)
- [ ] Examples work (`npm run examples`)
- [ ] CHANGELOG.md updated
- [ ] README.md updated if needed
- [ ] Version number updated in package.json
- [ ] Git changes committed and pushed

## Post-Publishing

1. **Verify the package:**
   ```bash
   npm view json-file-crud
   ```

2. **Test installation:**
   ```bash
   mkdir test-install
   cd test-install
   npm init -y
   npm install json-file-crud
   ```

3. **Update documentation** if needed

## Troubleshooting

- **403 Forbidden**: Make sure you're logged in and have permission to publish
- **Version already exists**: Update the version number
- **Tests fail**: Fix issues before publishing
- **Missing files**: Check .npmignore and package.json files array
