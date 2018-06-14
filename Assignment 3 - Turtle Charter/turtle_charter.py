import turtle  # import module

# count_observations function
def count_observations(path):
    """accepts the path of a file as argument and returns the number of observations (number of observations is equivalent to 3 lines):
    argument(s):
        path (str)
    return(s):
        number of observations"""
    num_of_obs = 0
    with open(path) as chart_data:          # open the file
        for line in chart_data:             # loop through each line in the file
            num_of_obs += 1                 
    return (num_of_obs/3.0)                 # return statement

# get_max_value function
def get_max_value(path, feature):
    """accepts the path and feature number as arguments and returns the maximum value for that feature in the file specified by the path:
    argument(s):
        path (str)
        feature (numeric)
    return(s):
        maximum value for the feature (numeric)"""
    max_value = 0
    line_num = 0
    with open(path) as chart_data:                  # open the file
        for line in chart_data:
            if line_num % 3 == feature:             # lines with the feature data
                if line_num < 3:                    # assign maximum value as the first observation
                    max_value = int(line)
                else:
                    if int(line) > max_value:       # re-assign the maximum value if the current observations is greater than the maximum value
                        max_value = int(line)       
            line_num += 1
    return max_value                                # return statement

# draw_x_axis function   
def draw_x_axis(num_of_obs, my_turtle, width):
    """accepts number of observations, turtle object and width of the window and draws the x axis accordingly: 
    argument(s):
        num_of_obs (numeric)
        my_turtle (turtle object)
        width (numeric)"""
    x_axis = width - 100                        # length of x-axis
    my_turtle.right(90)
    my_turtle.pd()
    my_turtle.forward(x_axis)
    my_turtle.backward(x_axis)

# draw_y_axis function
def draw_y_axis(max_feature, my_turtle, height):
    """accepts maximum value of feature, turtle object and height of the window and draws the y axis accordingly: 
    argument(s):
        max_feature (numeric)
        my_turtle (turtle object)
        height (numeric)""" 
    y_axis = height - 100                       # length of y-axis
    my_turtle.left(90)
    for i in range(10):                         # loop to draw the axes by sections (10)
        my_turtle.pd()
        my_turtle.forward(y_axis/10)            # move forward by the length of a section
        my_turtle.left(90)
        my_turtle.forward(5)                    # draw the tick
        my_turtle.pu()
        my_turtle.forward(20)
        my_turtle.left(90)
        my_turtle.forward(10)                   # reach the position to label
        my_turtle.write(round((i + 1) * (max_feature / 10), 2), align="center", font=("Arial", 10, "normal"))
        my_turtle.pu()
        my_turtle.goto(50, 50 + ((y_axis / 10) * (i + 1)))
        my_turtle.left(180)                     # reach the starting position for the next section
    my_turtle.backward(y_axis)

# draw_axes function
def draw_axes(count_obs, max_feature, my_turtle, height, width):
    """accepts number of observations, maximum value of feature, turtle object, screen height and width and draws the x- and y- axis:
    argument(s):
        count_obs (numeric)
        max_feature (numeric)
        my_turtle (turtle object)
        height (numeric)
        width (numeric)"""
    draw_y_axis(max_feature, my_turtle, height)         # calls the draw_y_axis function
    draw_x_axis(count_obs, my_turtle, width)            # calls the draw_x_axis function

def draw_rectangle(corx, cory, height, width, color, my_turtle):
    """accepts the x- and y- coordinates of starting location, height, weight, color of the rectangle and turtle object, 
    and draws the corresponding rectangle:
    argument(s):
        corx (numeric)
        cory (numeric)
        height (numeric)
        width (numeric)
        color ()
        my_turtle (turtle object)"""
    my_turtle.pu()
    my_turtle.goto(corx, cory)                  # reach the starting location
    my_turtle.pd()
    my_turtle.fillcolor(color)             # select the color for the shape
    my_turtle.begin_fill()                      # begin fill
    my_turtle.pd()                              
    my_turtle.forward(width)                    # begin drawing the rectangle
    my_turtle.left(90)
    my_turtle.forward(height)
    my_turtle.left(90)
    my_turtle.forward(width)
    my_turtle.left(90)
    my_turtle.forward(height)                   # end drawing the rectangle
    my_turtle.left(90)                          
    my_turtle.end_fill()                        # end fill

# draw_bars function
def draw_bars(path, feature, count_obs, height, width, my_turtle):
    """accepts path of chart data, feature, number of observations, height and width of the screen and turtle object,
    and draws the bars in the chart:
    argument(s):
        path (str)
        feature (numeric)
        count_obs (numeric)
        height (numeric)
        width (numeric)
        my_turtle (turtle object)"""
    width = width - 100                                                     # re-adjusting the width for the chart
    gap_size = 5                                                            # gap size
    bar_size = (width - (5 * (count_obs + 1))) / count_obs                  # bar size
    extension_factor = (height - 100) / get_max_value(path, feature)        # factor by which we multiply the feature values
    bar_height = 0
    line_num = 0
    label = ''
    my_turtle.forward(gap_size)
    with open(path) as chart_data:                                          # open the file
        for line in chart_data:
            if line_num % 3 == 0:                                           # extract the label
                label = line
                draw_x_axis_label(55 + (int(line_num / 3) * (bar_size + gap_size)), 50, label, my_turtle, bar_size)                                                
            elif line_num % 3 == 1:                                         # extract the feature value
                bar_height = int(line)
                my_turtle.pu()
                color = choose_color(bar_height * extension_factor, height - 100)
                draw_rectangle(55 + (int(line_num / 3) * (bar_size + gap_size)), 50, (bar_height * extension_factor), bar_size, color, my_turtle)
                                                                            # draw the rectangle by calling draw_rectangle()
                my_turtle.forward(gap_size + bar_size)
            line_num += 1

# draw_x_axis_label function
def draw_x_axis_label(corx, cory, label, my_turtle, bar_size):
    """accepts x- and y- coordinates, label, turtle object, and bar size, and writes the labels for each bar:
    argument(s):
        corx (numeric)
        cory (numeric)
        label (str)
        my_turtle (turtle object)
        bar_size (numeric)"""
    my_turtle.pu()
    my_turtle.goto(corx, cory)                        # reach the starting location
    my_turtle.pd()
    my_turtle.forward(bar_size / 2)                   # reach the center of the bar
    my_turtle.right(90)
    my_turtle.pu()
    my_turtle.forward(50)                             # reach the label location
    my_turtle.write(label, align="center", font=("Arial", 8, "normal"))                     # label
    my_turtle.backward(50)
    my_turtle.left(90)
    my_turtle.backward(bar_size / 2)                  # reach the starting coordinates
    my_turtle.pd()

# choose_color function
def choose_color(value, max_value):
    return ((222 - (222-49) * (value/max_value))/255, (235 - (235-130) * (value/max_value))/255, (247 - (247-189) * (value/max_value))/255)

# Execute only if run as a script
if __name__ == "__main__":
    # print("This is run as a script, not a module!")
    path = input("Which file to visualize?\n")                        # take the path for input file from the user
    chart_title = input("What should the chart be named?\n")          # take the chart title from the user
    
    # Figure out the dimensions of the turtle screen
    number_of_observations = count_observations(path)           # Get the number of observations
    maximum_value = get_max_value(path, 1)                      # Get the maximum value of the feature

    # A module for drawing a chart with the turtle

    # Define window size as constants
    window = turtle.Screen()  # create a window for the turtle to draw on
    window.title(chart_title)  # the title to show at the top of the window
    WINDOW_WIDTH = 800  # size constants for easy changing
    WINDOW_HEIGHT = 600
    window.setup(WINDOW_WIDTH, WINDOW_HEIGHT)  # specify window size (width, height)
    window.setworldcoordinates(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT)  # coordinate system: origin at lower-left

    # Create the turtle
    my_turtle = turtle.Turtle()
    my_turtle.speed("fastest")  # how fast the turtle should move

    # Move the turtle to draw
    my_turtle.penup()       # do not draw while moving
    my_turtle.goto(50,50)
    my_turtle.ht()

    draw_axes(number_of_observations, maximum_value, my_turtle, WINDOW_HEIGHT, WINDOW_WIDTH)

    draw_bars(path, 1, number_of_observations, WINDOW_HEIGHT, WINDOW_WIDTH, my_turtle)

    # Make the turtle graphics appear and run, waiting for the user to close the screen
    # This MUST be the last statement executed in the script
    window.mainloop()