#!/usr/bin/env bash 
## session.sh

## Use this file to record the command-line commands you use in the assignment.
## Add each command BELOW the descriptive comment:


# Display the current working directory
pwd

# Display the contents of the `.gitignore` file
cat .gitignore

# Make a new `sonnets` folder inside your repo
mkdir sonnets

# Change directory into the `sonnets` folder and display its contents 
# (2 commands)
cd sonnets
ls

# Copy the `.gitignore` file into the `sonnets` folder without changing 
# directories
cp ../.gitignore ../sonnets

# Display the contents of the `sonnets` folder to show it contains the hidden
# `.gitignore` filer
ls -a

# Add the `img` folder to git
git add ../sonnets

# Commit your change to git (with a descriptive message)
git commit -m "Add sonnets folder"
