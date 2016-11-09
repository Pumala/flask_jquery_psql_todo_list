$(document).ready(function() {
  updateList();

  function updateList() {

    // clear the task list
    $("#task-list").empty();

    $.get('/tasks', function gotData(tasks) {

      // loop through all the tasks and print them out
      tasks.forEach(function(task) {

        // create the html
        var html = '<li id="'+ task.id +'">';
        html += '<i class="fa checkbox fa-square-o"></i>';
        html += '<i class="fa fa-trash-o"></i>';
        html += '<p>' + task.description + '</p>';
        html += '</li>';

        // append the tasks to the page
        $("#task-list").append(html);

        var $li = $('#' + task.id);
        var $checkbox = $li.find('.checkbox');

        // check if task if done
        // if so, cross and check off the task
        if (task.done === true) {
          $li.addClass('completed');
          $checkbox.removeClass('fa-square-o');
          $checkbox.addClass('fa-check-square-o');
        } else {
          $li.removeClass('completed');
          $checkbox.addClass('fa-square-o');
          $checkbox.removeClass('fa-check-square-o');
        }
      });
    });
  }

  $("form").submit(function(event) {
    // prevent form submission
    event.preventDefault();

    // serialize encodes it to string format
    var $newTask = $("input").serialize();

    // clear the list
    $("#task-list").empty();

    // make a post request, pass in newTask that has been serialized
    // gotData grabs the data that the post request returns
    $.post('/add_task', $newTask, function gotData(task) {

      // list all the tasks
      updateList();

      // clear the input field value
      $("input").val("");
    });
  });

  // when you click on the checkbox
  // either add or remove the line-through on the task
  $("#task-list").on("click", ".checkbox", function() {
    var $li = $(this).closest("li");
    var is_done = false;

    if ($li.hasClass('completed')) {
      // change is_done to opposite boolean value
      is_done = false;
    } else {
      is_done = true
    }
    var data = {
      id: $li.attr("id"),
      done: is_done
    }
    // we pass in data, then in our route we grab that data
    // using request.form.get('insert_name_of_data_here_ie_=>_id')
    $.post('/mark_task', data, function gotData(data) {
      console.log(data.done);
      updateList();
    });
  });

  $("#task-list").on("click", ".fa-trash-o", function() {
    var $li = $(this).closest("li");
    var $task_id = $li.attr("id");
    // include the id in the route parameter to be later used
    // in our route to find the id of the task and delete the task
    $.post('/remove_task/' + $task_id, function gotData(data) {
      updateList()
    });
  });

});

// open up Network in your console and check the routes
// see what is being passed in :)
