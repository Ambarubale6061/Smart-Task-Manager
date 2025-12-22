import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/task_provider.dart';

class CreateEditTaskSheet extends ConsumerStatefulWidget {
  const CreateEditTaskSheet({super.key});

  @override
  ConsumerState<CreateEditTaskSheet> createState() => _CreateEditTaskSheetState();
}

class _CreateEditTaskSheetState extends ConsumerState<CreateEditTaskSheet> {
  final _formKey = GlobalKey<FormState>();
  String title = '';
  String description = '';
  String assignedTo = '';

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: MediaQuery.of(context).viewInsets.add(const EdgeInsets.all(16)),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              decoration: const InputDecoration(labelText: 'Title'),
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
              onSaved: (v) => title = v!,
            ),
            TextFormField(
              decoration: const InputDecoration(labelText: 'Description'),
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
              onSaved: (v) => description = v!,
              maxLines: 3,
            ),
            TextFormField(
              decoration: const InputDecoration(labelText: 'Assigned To'),
              onSaved: (v) => assignedTo = v ?? '',
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () async {
                if (_formKey.currentState!.validate()) {
                  _formKey.currentState!.save();
                  await ref.read(taskProvider.notifier).addTask({
                    "title": title,
                    "description": description,
                    "assigned_to": assignedTo
                  });
                  Navigator.pop(context);
                }
              },
              child: const Text('Save Task'),
            )
          ],
        ),
      ),
    );
  }
}
