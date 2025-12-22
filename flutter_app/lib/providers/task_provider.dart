import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../api/task_api.dart';
import '../models/task_model.dart';

final taskProvider = StateNotifierProvider<TaskNotifier, List<Task>>((ref) => TaskNotifier());

class TaskNotifier extends StateNotifier<List<Task>> {
  TaskNotifier() : super([]);

  final TaskAPI _api = TaskAPI();

  Future<void> loadTasks() async {
    final tasks = await _api.fetchTasks();
    state = tasks;
  }

  Future<void> addTask(Map<String, dynamic> taskData) async {
    final task = await _api.createTask(taskData);
    state = [task, ...state];
  }

  Future<void> updateTask(String id, Map<String, dynamic> taskData) async {
    final updatedTask = await _api.updateTask(id, taskData);
    state = state.map((t) => t.id == id ? updatedTask : t).toList();
  }

  Future<void> deleteTask(String id) async {
    await _api.deleteTask(id);
    state = state.where((t) => t.id != id).toList();
  }
}
