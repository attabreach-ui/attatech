#!/usr/bin/env python3
"""Batch fix null-safety issues across the codebase."""
import os, re, sys

ROOT = r'C:\Users\ATTA PC\Documents\kimi\workspace\github_attatech\src'

# Patterns to fix: config.X access without null check
# We replace direct config.X usage with safe defaults where needed
fixes = {
    # File -> list of (old_pattern, new_pattern)
}

# Instead, let's do targeted regex replacements
replacements = [
    # config.X.map without null check in JSX/expressions
    (r'config\.projects\.map\(', r'(config.projects || []).filter(Boolean).map('),
    (r'config\.projects\.filter\(', r'(config.projects || []).filter(Boolean).filter('),
    (r'config\.services\.map\(', r'(config.services || []).map('),
    (r'config\.faqs\.map\(', r'(config.faqs || []).map('),
    (r'config\.stats\.map\(', r'(config.stats || []).map('),
    (r'config\.testimonials\.filter\(', r'(config.testimonials || []).filter('),
    (r'config\.blogPosts\.filter\(', r'(config.blogPosts || []).filter('),
    (r'config\.blogPosts\.map\(', r'(config.blogPosts || []).map('),
    (r'config\.pricing\.map\(', r'(config.pricing || []).map('),
    (r'config\.whyChooseUs\.map\(', r'(config.whyChooseUs || []).map('),
    (r'config\.clientLogos\.map\(', r'(config.clientLogos || []).map('),
    (r'config\.techStack\.map\(', r'(config.techStack || []).map('),
]

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    for old, new in replacements:
        content = re.sub(old, new, content)
    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

changed = 0
for dirpath, dirnames, filenames in os.walk(ROOT):
    for fname in filenames:
        if fname.endswith(('.tsx', '.ts')):
            fpath = os.path.join(dirpath, fname)
            if process_file(fpath):
                changed += 1
                print(f'Fixed: {fpath}')

print(f'\nTotal files changed: {changed}')
