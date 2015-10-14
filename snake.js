$(document).ready(function() {
    //Canvas stuff
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();

    //Lets save the cell width in a variable for easy control
    var length = 5; //Length of the snake
    var cw = 10;
    var d;
    var food;
    var score;
    var game_loop;
    var corner;
    var food_x;
    var food_y;
    var temp_food;
    var nx;
    var ny;

    //Lets create the snake now
    var snake_array; //an array of cells to make up the snake

    function init() {
        d = "right"; //default direction
        create_snake();
        create_food(); //Now we can see the food particle
        //finally lets display the score
        score = 0;

        //Lets move the snake now using a timer which will trigger the paint function
        //every 60ms
        var speed = 10;
        if (typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(paint, speed);
    }

    init();

    function create_snake() {
        snake_array = []; //Empty array to start with
        snake_coordinates = [];
        length = 5;
        for (var i = length - 1; i >= 0; i--) {
            //This will create a horizontal snake starting from the top left
            snake_array.push({
                x: i,
                y: 0
            });
        }
    }

    //Lets paint the snake now
    function paint() {

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);

        nx = snake_array[0].x;
        ny = snake_array[0].y;

        if (d == "right") nx++;
        else if (d == "left") nx--;
        else if (d == "up") ny--;
        else if (d == "down") ny++;

        if (nx == food.x && ny == food.y) {
            var tail = {
                x: nx,
                y: ny
            };
            score++;
            length++;
            //Create new food
            create_food();
            if (food.x != nx && food.y != ny) {
                create_food()
            }
        } else {
            var tail = snake_array.pop(); //pops out the last cell
            tail.x = nx;
            tail.y = ny;

        }

        if (nx == -1 || nx == w / cw || ny == -1 || ny == h / cw || check_collision(nx, ny, snake_array)) {
            //restart
            init();
            //Lets organize the code a bit now.
            return;
        }

        snake_array.unshift(tail); //puts back the tail as the first cell

        for (var i = 0; i < snake_array.length; i++) {
            var c = snake_array[i];
            //Lets paint 10px wide cells
            paint_cell(c.x, c.y, 'blue');
        }

        //Lets paint the food
        paint_cell(food.x, food.y, 'red');
        //Lets paint the score
        var score_text = "Score: " + score;
        ctx.fillText(score_text, 5, h - 5);
        /*
                $('#snake').empty();
                $('#snake').append("<tr></tr><tr></tr>");

                for (var i = length-1; i >= 0; i--) {
                $('#snake tr:nth-child(1)').append("<td>["+i+"]</td>");    
                $('#snake tr:nth-child(2)').append("<td>"+snake_array[i].x +"x"+snake_array[i].y+"</td>");
                }*/

        // autopilot here

        corner = get_corner_val(snake_array[0].x, snake_array[0].y, snake_array[1].x, snake_array[1].y);

        if ((nx == 0 || nx == (w - cw) / cw) && (ny == 0 || ny == (w - cw) / cw)) {
            switch (corner) {
                case 1:
                    down();
                    break; //1
                case 87:
                    down();
                    break; //2
                case 90:
                    left();
                    break; //3
                case 262:
                    left();
                    break; //4
                case 263:
                    up();
                    break; //5
                case 177:
                    up();
                    break; //6
                case 174:
                    right();
                    break; //7
                case 2:
                    right();
                    break; //8
            }

        } else if (nx == (w - cw) / cw || nx == 0 || ny == (w - cw) / cw || ny == 0) {
            if (nx + 1 == w / cw) {
                if (ny < (h / cw) / 2 && d != "down") {
                    down();
                } else if (d != "up") {
                    up();
                };
            }
            if (nx == 0) {
                if (ny < (h / cw) / 2 && d != "down") {
                    down();
                } else if (d != "up") {
                    up();
                };
            }

            if (ny + 1 == h / cw) {
                if (nx < (w / cw) / 2 && d != "right") {
                    right();
                } else if (d != "left") {
                    left();
                };
            }
            if (ny == 0) {
                if (nx < (w / cw) / 2 && d != "right") {
                    right();
                } else if (d != "left") {
                    left();
                };
            }
        }
        if (snake_array.length > 100) {
        spiral();
         }
        if (nx == food.x && possible_collision()) {
            food_location("x");
        }
        if (ny == food.y && possible_collision()) {
            food_location("y");
        }

    }

    function possible_collision() {
        if (d == "left" || d == "right") {
            for (i = 1; i < snake_array.length; i++) {
                if (snake_array[0].x == snake_array[i].x) {
                    if (Math.abs(snake_array[0].y - snake_array[i].y) <= (snake_array.length - i))
                        return false;
                }
            }
        }
        if (d == "up" || d == "down") {
            for (i = 1; i < snake_array.length; i++) {
                if (snake_array[0].y == snake_array[i].y) {
                    if (Math.abs(snake_array[0].x - snake_array[i].x) <= (snake_array.length - i))
                        return false;
                }
            }
        }

        console.log("Lenght:" + snake_array.length);
        return true;
    }

    function spiral() {
            if (snake_array[0].x == 44 && snake_array[0].y == 0) {
                    console.log("End of the line");
            }
        return true;
    }

    function food_location(coordinate) {
        if (coordinate == "x") {
            if (snake_array[0].y < food.y) {
                return down();
            } else return up();
        };
        if (coordinate == "y") {
            if (snake_array[0].x < food.x) {
                return right();
            } else return left();
        };
    }
    //Lets create the food now
    function create_food() {
        while (1) {

            food_x = Math.round(Math.random() * (w - cw) / cw);
            food_y = Math.round(Math.random() * (h - cw) / cw);

            food_temp = {
                x: food_x,
                y: food_y,
            };

            //if food does not collide with snake
            if (food_x != snake_array[0].x && food_y != snake_array[0].y && check_food_snake_collision()) {
                //for (var i = snake_array.length; i >= 0; i--) {     
                break;
            }
        }
        food = {
            x: food_x,
            y: food_y,
        };

        if (!check_food_snake_collision())
            console.log(JSON.stringify("COLLIDED"));


        function check_food_snake_collision() {
            for (i = 0; i < snake_array.length; i++) {
                if (JSON.stringify(food_temp) === JSON.stringify(snake_array[i])) {
                    console.log("TRIED TO COLLIDE")
                    return false;
                }
            }
            return true;
        }

        //This will create a cell with x/y between 0-44
        //Because there are 45(450/10) positions accross the rows and columns
    }
    //Lets first create a generic function to paint cells
    function get_corner_val(x1, y1, x2, y2) {
        return (x1 + y1 * 2 + x2 + y2 * 2);
    }

    function paint_cell(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * cw, y * cw, cw, cw);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x * cw, y * cw, cw, cw);
    }

    function check_collision(x, y, array) {
        //This function will check if the provided x/y coordinates exist
        //in an array of cells or not
        for (var i = 0; i < array.length; i++) {
            if (array[i].x == x && array[i].y == y)
                return true;
        }
        return false;
    }

    //Lets add the keyboard controls now
    $(document).keydown(function(e) {
        var key = e.which;
        //We will add another clause to prevent reverse gear
        if (key == "37" && d != "right") d = "left";
        else if (key == "38" && d != "down") d = "up";
        else if (key == "39" && d != "left") d = "right";
        else if (key == "40" && d != "up") d = "down";
        //The snake is now keyboard controllable
    })

    //Diretion change functions
    function down() {
        e = jQuery.Event("keydown");
        e.which = 40 //enter key
        jQuery('canvas').trigger(e);
    }

    function up() {
        e = jQuery.Event("keydown");
        e.which = 38 //enter key
        jQuery('canvas').trigger(e);
    }

    function left() {
        e = jQuery.Event("keydown");
        e.which = 37 //enter key
        jQuery('canvas').trigger(e);
    }

    function right() {
        e = jQuery.Event("keydown");
        e.which = 39 //enter key
        jQuery('canvas').trigger(e);
    }

})