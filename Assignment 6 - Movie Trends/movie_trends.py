# import the TMDB_KEY from apikeys
from apikeys import TMDB_KEY


# import the required modules
import sys

import requests
import pandas as pd
import datetime as dt
import requests
import calendar
import time

from bokeh.plotting import figure, output_file, show
from bokeh.models import FuncTickFormatter

def count_release_genre(genre_id, start_date, end_date):
    """Counts and returns the total number of Releases occured between a start date and an and date based on user provided date."""

    resource_uri = "https://api.themoviedb.org/3/discover/movie"

    query_params = {'api_key': TMDB_KEY, 'language': 'en-US', 'primary_release_date.gte': start_date,
                    'primary_release_date.lte': end_date, 'with_genres': genre_id}
    
    print('.',end=' ',flush=True)
    response = requests.get(resource_uri, params=query_params)
    total = response.json()

    return(total['total_results'])


def get_genrecountlist(genre_list,year):
    """Here the user provides the genre list and the year. This function returns a list of Genres with release count for each month of the year."""

    print("Wait till we fetch",flush = True)
    resource_uri = "https://api.themoviedb.org/3/genre/movie/list"
    query_params = {'api_key': TMDB_KEY, 'language': 'en-US'}
    response = requests.get(resource_uri, params=query_params)
    genre = response.json()
    genres_dict = dict()
    genre_count_list = list()

    for i in genre.values():
        j = 0
        while j < len(i) :
            genres_dict[i[j]["id"]] = i[j]['name']
            j += 1

    genre_list = [k for l in genre_list for k,v in genres_dict.items() if v.lower() == l.lower() ]

    for v in genre_list:
        d = dict()
        d1 = dict()
        for month in range(1, 13):
            sdate = str(year)+'-' + str(month) + '-01'  
            edate = last_day_of_month(dt.date(year, month, 1))  
            
            d1[calendar.month_abbr[month]] = count_release_genre(v,sdate,edate)
            
            
        d = {genres_dict[v]: d1}
        
        genre_count_list.append(d)
        
    return (genre_count_list)


def last_day_of_month(any_day):
    """Takes in a date value and returns the last day for that particluar month."""
    
    next_month = any_day.replace(day = 28) + dt.timedelta(days = 4) 
    
    return next_month - dt.timedelta(days = next_month.day)





def plot_graph(genre_list,year):

    col_count = 1  
    color_pal =  {1:"blue",2:"magenta",3:"cyan",4:"green",5:"red"} ## A predefined color palette for 5 Genres.
    
    # output to static HTML file
    output_file("genre_by_season.html")

    # create a new plot with a title and axis labels
    p = figure(title = "Releases by Genre - " + str(year) , x_axis_label = 'Month', y_axis_label = 'Releases',
    x_range = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
    
    print(flush=True)
    
    for rec in genre_list:  ## For each record in Genre_List

        for k, v in rec.items():  ## For key and values in rec distionary

            leg = k                 ## set legend as the Genre in leg variable
            x = list()
            y = list()

            for k, v in v.items():

                x.append(k)
                y.append(v)
            
            p.line(x, y, legend = leg, line_width = 2, line_color = color_pal[col_count])
            col_count += 1

    show(p)


def choice():
    print("These are the following options: \n")
    print('Action        Adventure     Animation     Comedy      Crime') 
    print('Documentary   Drama         Family        Fantasy     History') 
    print('Horror        Music         Mystery       Romance     Science Fiction') 
    print('TV Movie      Thriller      War           Western','\n')
    
    user_list =  input('Enter comma seperated values for movie genres\n')
    user_year = int(input("Please enter the year?\n"))
    user_list = [value.strip() for value in user_list.split(',')][:5] 

    plot_graph(get_genrecountlist(user_list,user_year),user_year)

#Prateek
# define a function to return the actor id
def get_actor_id(name):
    """This function accepts the name of an actor (string) and returns its 'id' (numeric) 
    as returned by the The Movie Database API"""
    
    # construct the query parameters
    query_params = {"api_key": TMDB_KEY, "query": name}
    
    # hit the API with the request and store the response
    response = requests.get("https://api.themoviedb.org/3/search/person?", params = query_params)
    
    # extract the actor id
    actor_id = response.json()['results'][0]['id']
    
    # return statement
    return(actor_id)


# define a function to get the list of all the movies for an actor's 'id'
def get_movie_ids(id):
    """This function accepts an actor's 'id' (numeric) and returns the movie list 'with_cast' having this 'id'"""
    
    movie_ids = []                      # list to store the movie ids
    
    i = 1                               # initialize the iterator
    
    while True:                         # loop through the pages to retrive all the movies for the actor 'id'
        
        # contruct the quey parameters
        query_params = {"api_key": TMDB_KEY, "sort_by": 'release_date.asc', 
                        "page": i, "with_cast": id}
        
        # hit the API with the request and store the response
        response = requests.get("https://api.themoviedb.org/3/discover/movie?", params = query_params)
        
        if len(response.json()['results']) == 0:  
            break                       # break out of the loop if ['results'] return 0
            
        i += 1                          # increment the iterator
        
        # append the movie list with extracted movie_ids from each page
        movie_ids.extend([movie['id'] for movie in response.json()['results']])
    
    # return statement
    return(movie_ids)


# define a function to return the popularity metrics
def popularity(ids):
    """This function accepts the 'movie_ids' and returns the dataframe of each movie's release_date' as index
    and popularity (revenue - budget) as attribute, where both revenue and budget are above 1000"""
    
    popularity = {}                                       # create an empty dictionary
    
    # contruct the quey parameters
    query_params = {"api_key": TMDB_KEY}

    print("Wait till we fetch", flush = True)
    
    # loop through movie_ids to compute the popularity
    for i in ids:
        
        print(". ", end = '')
        sys.stdout.flush()

        # hit the API with the request and store the response
        response = requests.get("https://api.themoviedb.org/3/movie/" + str(i) + "?", params = query_params)
        
        if ((response.json()['revenue'] >= 1000) & (response.json()['budget'] >= 1000)):
            
            popularity[response.json()["release_date"]] = (response.json()['revenue'] - response.json()['budget'])
            
    actor_popularity = pd.DataFrame.from_dict(popularity, orient = 'index')
    
    actor_popularity.columns = ['Popularity']
    
    # return statement
    return(actor_popularity)


# define a function to create the visualization
def plot_popularity(actor_popularity, name):
    """This function accepts an actor name (string) and an actor popularity dataframe with index 
    as the movie release date (datetime) and popularity (revenue - budget) column"""

    # output to static HTML file
    output_file("actor_popularity.html")

    # create a new plot with a title and axis labels
    p = figure(title = name + " Popularity over Time", x_axis_label = 'Date', 
               y_axis_label = 'Revenue ($)', x_axis_type='datetime')

    x = list(map(lambda x : dt.datetime.strptime(x, '%Y-%m-%d'), actor_popularity.index.values))
    y = actor_popularity['Popularity'].values

    # add a line renderer with legend and line thickness
    p.line(x, y, line_width = 2)

    # show the results
    show(p)

def actor_choice():
    actor_name = input("Actor's Name:\n")                        # take the path for input file from the user

    actor_id = get_actor_id(actor_name)                          # get the actor's id
    movie_ids = get_movie_ids(actor_id)                          # get the movie_id list for the actor_id
    pop = popularity(movie_ids)                           # create the popularity dataframe for the actor

    plot_popularity(pop, actor_name)    


def main():
    print('Which analysis do you want to perform? \n')
    print('1. Analyze the distribution of film releases of different genres by year')
    print('2. Analyze the popularity of a particular actor')
    user_input=input("Please enter the choice (1/2): \n")
    if(user_input=='1'):
        choice()
    if (user_input=='2'):
        actor_choice()   
    else:
        print('Please enter a valid choice')
        time.sleep(2)
        main()

# Execute only if run as a script
if __name__ == "__main__":
    main()