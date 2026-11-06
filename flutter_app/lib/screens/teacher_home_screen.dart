import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class TeacherHomeScreen extends StatefulWidget {
  const TeacherHomeScreen({super.key});

  @override
  State<TeacherHomeScreen> createState() => _TeacherHomeScreenState();
}

class _TeacherHomeScreenState extends State<TeacherHomeScreen> {
  int _currentIndex = 0;

  final List<Map<String, dynamic>> _teacherServices = [
    {
      "title": "Take Attendance",
      "icon": Icons.how_to_reg_rounded,
      "bg": const Color(0xFFE8F5E9),
      "color": const Color(0xFF2E7D32),
    },
    {
      "title": "Marks Entry",
      "icon": Icons.edit_note_rounded,
      "bg": const Color(0xFFEDE7F6),
      "color": const Color(0xFF512DA8),
    },
    {
      "title": "Homework",
      "icon": Icons.menu_book_rounded,
      "bg": const Color(0xFFE1F5FE),
      "color": const Color(0xFF0277BD),
    },
    {
      "title": "Leave Approve",
      "icon": Icons.rule_rounded,
      "bg": const Color(0xFFFFF3E0),
      "color": const Color(0xFFE65100),
    },
    {
      "title": "Remarks",
      "icon": Icons.rate_review_rounded,
      "bg": const Color(0xFFF1F8E9),
      "color": const Color(0xFF558B2F),
    },
    {
      "title": "Notice",
      "icon": Icons.campaign_rounded,
      "bg": const Color(0xFFFFEBEE),
      "color": const Color(0xFFC62828),
    },
    {
      "title": "Time Table",
      "icon": Icons.access_time_rounded,
      "bg": const Color(0xFFE0F2F1),
      "color": const Color(0xFF00695C),
    },
    {
      "title": "Messages",
      "icon": Icons.chat_bubble_outline_rounded,
      "bg": const Color(0xFFE0F7FA),
      "color": const Color(0xFF00838F),
    },
    {
      "title": "Reports",
      "icon": Icons.bar_chart_rounded,
      "bg": const Color(0xFFF3E5F5),
      "color": const Color(0xFF7B1FA2),
    },
  ];

  void _openQuickAttendance() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(20),
          height: MediaQuery.of(context).size.height * 0.75,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  const Text(
                    "Quick Attendance (Class 10-A)",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF05574F),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const Text(
                "Click submit to send instant notifications to all parents.",
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
              const SizedBox(height: 12),
              // Quick action buttons
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2E7D32),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () {},
                      icon: const Icon(Icons.done_all),
                      label: const Text("All Present"),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.red,
                        side: const BorderSide(color: Colors.red),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () {},
                      icon: const Icon(Icons.clear),
                      label: const Text("Clear"),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Expanded(
                child: ListView(
                  children: [
                    _studentAttendanceTile("Aarav Sharma", "Roll 101", true),
                    _studentAttendanceTile("Ananya Verma", "Roll 102", true),
                    _studentAttendanceTile("Rohan Patel", "Roll 103", false),
                    _studentAttendanceTile("Priya Nair", "Roll 104", true),
                    _studentAttendanceTile("Vihaan Gupta", "Roll 105", false),
                  ],
                ),
              ),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF05574F),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text("Attendance saved! Instant notification sent to parents."),
                        backgroundColor: Color(0xFF05574F),
                      ),
                    );
                  },
                  child: const Text("Submit Attendance & Notify Parents"),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _studentAttendanceTile(String name, String roll, bool isPresent) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 18,
                backgroundColor: const Color(0xFF05574F),
                child: Text(name[0], style: const TextStyle(color: Colors.white, fontSize: 13)),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  Text(roll, style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
                ],
              ),
            ],
          ),
          Row(
            children: [
              ChoiceChip(
                label: const Text("P", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                selected: isPresent,
                selectedColor: const Color(0xFFE8F5E9),
                labelStyle: TextStyle(color: isPresent ? Colors.green.shade800 : Colors.black),
                onSelected: (_) {},
              ),
              const SizedBox(width: 6),
              ChoiceChip(
                label: const Text("A", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                selected: !isPresent,
                selectedColor: const Color(0xFFFFEBEE),
                labelStyle: TextStyle(color: !isPresent ? Colors.red.shade800 : Colors.black),
                onSelected: (_) {},
              ),
            ],
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final String formattedDate = DateFormat('EEE, d MMM yyyy').format(DateTime.now());

    return Scaffold(
      backgroundColor: const Color(0xFFF4F6F8),
      body: Stack(
        children: [
          // Dark Green Header (#05574F)
          Container(
            height: 240,
            width: double.infinity,
            decoration: const BoxDecoration(
              color: Color(0xFF05574F),
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(32),
                bottomRight: Radius.circular(32),
              ),
            ),
            padding: const EdgeInsets.only(top: 50, left: 20, right: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 24,
                          backgroundColor: Colors.white,
                          child: CircleAvatar(
                            radius: 22,
                            backgroundColor: const Color(0xFFFDBE3E),
                            child: const Text(
                              "R",
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF05574F)),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              "Dr. Rajesh Sharma",
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                            Text(
                              "Class Teacher: Class 10-A • Math HOD",
                              style: TextStyle(fontSize: 11, color: Color(0xFFB2DFDB), fontWeight: FontWeight.w500),
                            ),
                          ],
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.notifications_none, color: Colors.white, size: 26),
                      onPressed: () {},
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    const Text("Session 2026-2027", style: TextStyle(color: Colors.white70, fontSize: 13)),
                    Text(formattedDate, style: const TextStyle(color: Color(0xFFB2DFDB), fontSize: 12, fontWeight: FontWeight.w600)),
                  ],
                ),
              ],
            ),
          ),

          // Scrollable Grid
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.only(top: 135, left: 16, right: 16, bottom: 90),
              child: Column(
                children: [
                  // White rounded card with 3-column icon grid
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 15,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Teacher Controls",
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF05574F)),
                        ),
                        const SizedBox(height: 16),
                        GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: _teacherServices.length,
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 3,
                            crossAxisSpacing: 12,
                            mainAxisSpacing: 18,
                            childAspectRatio: 0.88,
                          ),
                          itemBuilder: (context, index) {
                            final item = _teacherServices[index];
                            return InkWell(
                              onTap: () {
                                if (item["title"] == "Take Attendance") {
                                  _openQuickAttendance();
                                }
                              },
                              borderRadius: BorderRadius.circular(16),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Container(
                                    width: 54,
                                    height: 54,
                                    decoration: BoxDecoration(
                                      color: item["bg"],
                                      shape: BoxShape.circle,
                                    ),
                                    child: Icon(item["icon"], color: item["color"], size: 26),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    item["title"],
                                    textAlign: TextAlign.center,
                                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF263238)),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),

      // Bottom Bar with Yellow (#FDBE3E) Quick Attendance Action Button
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 20, offset: const Offset(0, -4))],
        ),
        child: BottomAppBar(
          color: Colors.white,
          elevation: 0,
          shape: const CircularNotchedRectangle(),
          notchMargin: 8.0,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              IconButton(
                icon: Icon(Icons.home_rounded, color: _currentIndex == 0 ? const Color(0xFF05574F) : Colors.grey.shade400, size: 28),
                onPressed: () => setState(() => _currentIndex = 0),
              ),
              IconButton(
                icon: Icon(Icons.group_outlined, color: _currentIndex == 1 ? const Color(0xFF05574F) : Colors.grey.shade400, size: 28),
                onPressed: () => setState(() => _currentIndex = 1),
              ),
              const SizedBox(width: 48),
              IconButton(
                icon: Icon(Icons.bar_chart_rounded, color: _currentIndex == 3 ? const Color(0xFF05574F) : Colors.grey.shade400, size: 28),
                onPressed: () => setState(() => _currentIndex = 3),
              ),
              IconButton(
                icon: Icon(Icons.person_outline_rounded, color: _currentIndex == 4 ? const Color(0xFF05574F) : Colors.grey.shade400, size: 28),
                onPressed: () => setState(() => _currentIndex = 4),
              ),
            ],
          ),
        ),
      ),

      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: FloatingActionButton(
        elevation: 6,
        backgroundColor: const Color(0xFFFDBE3E), // Design Guide Yellow (#FDBE3E)
        shape: const CircleBorder(),
        onPressed: _openQuickAttendance,
        tooltip: "Quick Attendance (हाजिरी लगाएं)",
        child: const Icon(Icons.check_rounded, color: Color(0xFF05574F), size: 34),
      ),
    );
  }
}
