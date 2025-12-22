import 'package:flutter/material.dart';
import '../models/task_model.dart';
import '../utils/constants.dart';

class TaskCard extends StatelessWidget {
  final Task task;
  final VoidCallback? onTap;

  const TaskCard({required this.task, this.onTap, super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      margin: EdgeInsets.symmetric(vertical: 6, horizontal: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: ListTile(
        onTap: onTap,
        title: Text(task.title, style: TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(task.description, maxLines: 2, overflow: TextOverflow.ellipsis),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Chip(
              label: Text(task.category),
              backgroundColor: categoryColors[task.category] ?? Colors.grey,
            ),
            SizedBox(height: 4),
            Chip(
              label: Text(task.priority),
              backgroundColor: priorityColors[task.priority] ?? Colors.green,
            ),
          ],
        ),
      ),
    );
  }
}
