'use strict';

//SENTIMENTS, EMOTIONS, and SAMPLE_TWEETS have already been "imported"

/* Your script goes here */

// This function accepts a tweet's text (string) and splits it up into an array of individual words (string).
function extractWords(text){

    // split the text into component words
    var rawWords = text.split(/\W+/);

    // convert the words to lowercase using 'map'
    var lowercaseWords = rawWords.map(function(i){
        return i.toLowerCase();
    });
    
    // filter out words with length equal to one or lower
    var finalWords = lowercaseWords.filter(function(i){
        return i.length > 1;
    });
    
    // return statement
    return(finalWords);
}

// This function accepts an array of the words (string) and an emotion (string) and,
// returns an array of the words to get only those words that contain that specific emotion.
function filterEmotion(wordsList, emotion){

    // filter the list of the words
    var finalWords = wordsList.filter(function(i){
        if(SENTIMENTS[i] != undefined){
            if (SENTIMENTS[i][emotion] != undefined){
                return(i);
            }
        }
    });
    
    // return statement
    return(finalWords);
}

// This function accepts an array of the words (string) and, returns an object with an array of words for each emotion.
function emotionWords(wordsList){

    // create the object by filtering for each emotion    
    var finalDict = {};

    for(var i of EMOTIONS){

        finalDict[i] = filterEmotion(wordsList, i);
    }

    // return statement
    return(finalDict);
}

// This function accepts an array of the words (string) and, returns an array containing each word in the original array, 
// in descending order by how many times that word appears in the original array.
function mostCommon(wordsList){

    var wordsCount = {};

    // create an object of all the words (key) and their count (value) 
    for(var i of wordsList){

        wordsCount[i] = 0;
    }

    // populate the wordsCount object
    for(var j in wordsCount){

        for(var k of wordsList){

            if(j === k){

                wordsCount[j] += 1;
            }                
        }            
    }

    // sort the words according to their count in descending order
    var sortedWords = Object.keys(wordsCount).sort(function(a, b){
        return wordsCount[b] - wordsCount[a]
    });

    // return statement 
    return(sortedWords);
}
    
// This function takes in an array of tweet objects and returns an array of all the words included in those tweets.
function getAllWords(tweetObjects){

    // extract all the words from the array of tweet objects
    var allWords = tweetObjects.reduce(function(list, words){
        return list.concat(extractWords(words['text'])); 
    }, []);

    // return statement
    return(allWords);
}

// This function takes in two parameters: an array of tweet objects and a single emotion (e.g., "happy"), and
// returns a new array of all the hashtags that are used in tweets that have at least one word with that emotion.
function getEmotionHashtags(tweetObjects, emotion){

    // create an array of tweets with atleast a word with that emotion
    var allTweets = tweetObjects.filter(function(i){
        var dictEmotion = emotionWords(extractWords(i['text']));
        if (dictEmotion[emotion].length != 0){
            return i;            
        } 
    });

    // create an array of hashtags that are used in tweets that have at least one word with that emotion
    var allHashtags = allTweets.reduce(function(list, tweet){
        return list.concat(tweet['entities']['hashtags'].map(function (item){
            return item['text'].toLowerCase();
        }))
    }, []);

    // return statement
    return(allHashtags);
}

// This function accepts the tweets in the 'SAMPLE_TWEETS' format and returns the object with the sentiment analysis.
function analyzeTweets(tweets){

    // loop through each tweet
    var wordsList = getAllWords(tweets);
        
    // segregate words as per each sentiment
    var emotionsObject = emotionWords(wordsList);
    
    // create final return object
    var finalObject = {};
    
    // populate the finalObject
    Object.keys(emotionsObject).map(function(item){
        finalObject[item] = [
            emotionsObject[item].length / wordsList.length,
            mostCommon(emotionsObject[item]),
            mostCommon(getEmotionHashtags(tweets, item))
        ];
    });

    // return statement
    return(finalObject);
}

// This function accepts the object returned by 'analyzeTweets' function and displays it in the form of a table.
function showEmotionData(analysis){

    // select the table
    var table = d3.select('#emotionsTableContent');

    // clear the table
    table.html('');
    
    // sort the analysis by the '% of Words'
    var sortedAnalysis = Object.keys(analysis).sort(function(a, b){return analysis[b][0] - analysis[a][0]});
    
    // loop to create and populate the rows
    for (var i in sortedAnalysis){

        table.append('tr').attr('id', i);
        var row = d3.select("#\\3" + i + " ");

        // create the row element
        row.html(`<td>${sortedAnalysis[i]}</td>` + 
        `<td>${(analysis[sortedAnalysis[i]][0] * 100).toFixed(2)}%</td>` +
        `<td>${analysis[sortedAnalysis[i]][1].slice(0, 3).join(', ')}</td>` +
        `<td>${(analysis[sortedAnalysis[i]][2].slice(0, 3)).map(function (item){return ('#' + item);}).join(', ')}</td>`);
    }
}

// This function takes in a Twitter username (string) and sends an AJAX request (an asynchronous HTTP request) for
// the user's timeline data, analyzes that data (using your analyzeTweets() function), and then displays the
// results (using showEmotionData() function)
async function loadTweets(username){

    // create the uri
    var uri = "https://faculty.washington.edu/joelross/proxy/twitter/timeline/?screen_name=" 
    + username + "&count=200";

    // get the tweets
    var tweets = await d3.json(uri);

    // perform the analysis
    showEmotionData(analyzeTweets(tweets));
}

// analyze 'SAMPLE_TWEETS' as the page opens
showEmotionData(analyzeTweets(SAMPLE_TWEETS));

// take the twitter handle as an input from the user and perform the analysis
d3.select('#searchButton').on('click', async function(){

    // access the text entered in the searchbox on click 
    var username = d3.select('#searchBox').property('value');

    // perform the analysis
    loadTweets(username);
})