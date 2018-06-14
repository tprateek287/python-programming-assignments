#!/usr/bin/env bash 
## analysis.sh

# Download the sonnets
curl http://www.gutenberg.org/cache/epub/1041/pg1041.txt > sonnets/sonnets.txt

# Trim introduction and concluding lines
head sonnets/sonnets.txt --lines=2661 | tail --lines=2618 | cut -c 3- > sonnets/cleaned-sonnets.txt


# Remove leading blank characters 

 
# Split sonnets into individual files. This will involve *many* commands.
cd sonnets/

head cleaned-sonnets.txt --lines=1666 > sonnets-1-.txt
head cleaned-sonnets.txt --lines=1685 | tail --lines=18 > sonnet-2-aa.txt
head cleaned-sonnets.txt --lines=2127 | tail --lines=442 > sonnets-3-.txt
head cleaned-sonnets.txt --lines=2142 | tail --lines=15 > sonnet-4-aa.txt
tail cleaned-sonnets.txt --lines=476 > sonnets-5-.txt

split --lines=17 sonnets-1-.txt sonnet-1- --additional-suffix=.txt
split --lines=17 sonnets-3-.txt sonnet-3- --additional-suffix=.txt
split --lines=17 sonnets-5-.txt sonnet-5- --additional-suffix=.txt

rm sonnets-?-.txt

# Find the longest sonnet (most words)
wc --word sonnet-?-*.txt | sort -g -r > lengths.txt

# Search for specific words in  the sonnets
grep "truth" sonnet-?-*.txt > truth.txt
grep "love" sonnet-?-*a.txt > love.txt
