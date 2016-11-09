from flask import Flask, jsonify, request, redirect
import pg

app = Flask('todo_list')
db = pg.DB(dbname='todo_list_db')

@app.route('/')
def home():
    return app.send_static_file('index.html')

@app.route('/tasks')
def list_tasks():
    results = db.query('select * from task').dictresult();

    return jsonify(results)

# insert new task into db
@app.route('/add_task', methods=['POST'])
def add_task():
    task = request.form.get('description')

    db.insert(
        'task', {
            'description': task,
            'done': False
        }
    );

    return task;

@app.route('/mark_task', methods=['POST'])
def mark_task():
    print request.form;

    task_id = int(request.form.get('id'))
    is_task_done = request.form.get('done')

    results = db.update(
        'task', {
            'id': task_id,
            'done': is_task_done
        }
    )

    return jsonify(results)

@app.route('/remove_task/<task_id>', methods=['POST'])
def remove_task(task_id):

    print task_id

    db.delete(
        'task',
            {
                'id': task_id
            }
    );
    return "Hellow there"

if __name__ == '__main__':
    app.run(debug=True)
