import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/task_provider.dart';
import '../widgets/summary_card.dart';
import '../widgets/task_card.dart';
import '../widgets/create_edit_task_sheet.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    ref.read(taskProvider.notifier).loadTasks();
  }

  @override
  Widget build(BuildContext context) {
    final tasks = ref.watch(taskProvider);
    final pending = tasks.where((t) => t.status == 'pending').length;
    final inProgress = tasks.where((t) => t.status == 'in_progress').length;
    final completed = tasks.where((t) => t.status == 'completed').length;

    return Scaffold(
      appBar: AppBar(title: const Text('Smart Task Manager')),
      body: RefreshIndicator(
        onRefresh: () => ref.read(taskProvider.notifier).loadTasks(),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  SummaryCard(title: 'Pending', count: pending, color: Colors.orange),
                  SummaryCard(title: 'In Progress', count: inProgress, color: Colors.blue),
                  SummaryCard(title: 'Completed', count: completed, color: Colors.green),
                ],
              ),
              const SizedBox(height: 12),
              ListView.builder(
                physics: const NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                itemCount: tasks.length,
                itemBuilder: (context, index) {
                  final task = tasks[index];
                  return TaskCard(task: task, onTap: () {});
                },
              )
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.add),
        onPressed: () {
          showModalBottomSheet(
            context: context,
            isScrollControlled: true,
            builder: (_) => const CreateEditTaskSheet(),
          );
        },
      ),
    );
  }
}
