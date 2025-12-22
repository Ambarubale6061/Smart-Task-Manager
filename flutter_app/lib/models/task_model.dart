class Task {
  String id;
  String title;
  String description;
  String category;
  String priority;
  String status;
  String assignedTo;
  DateTime? dueDate;

  Task({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.priority,
    required this.status,
    required this.assignedTo,
    this.dueDate,
  });

  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      id: json['id'],
      title: json['title'],
      description: json['description'] ?? '',
      category: json['category'] ?? 'general',
      priority: json['priority'] ?? 'low',
      status: json['status'] ?? 'pending',
      assignedTo: json['assigned_to'] ?? '',
      dueDate: json['due_date'] != null ? DateTime.parse(json['due_date']) : null,
    );
  }
}
