import 'package:dio/dio.dart';
import '../models/task_model.dart';
import '../utils/constants.dart';

class TaskAPI {
  final Dio _dio = Dio();

  Future<List<Task>> fetchTasks({int limit=50, int offset=0}) async {
    try {
      final response = await _dio.get(API_BASE_URL, queryParameters: {"limit": limit, "offset": offset});
      List data = response.data;
      return data.map((t) => Task.fromJson(t)).toList();
    } catch (e) {
      throw Exception('Failed to load tasks');
    }
  }

  Future<Task> createTask(Map<String, dynamic> taskData) async {
    try {
      final response = await _dio.post(API_BASE_URL, data: taskData);
      return Task.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to create task');
    }
  }

  Future<Task> updateTask(String id, Map<String, dynamic> taskData) async {
    try {
      final response = await _dio.patch('$API_BASE_URL/$id', data: taskData);
      return Task.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to update task');
    }
  }

  Future<void> deleteTask(String id) async {
    try {
      await _dio.delete('$API_BASE_URL/$id');
    } catch (e) {
      throw Exception('Failed to delete task');
    }
  }
}
