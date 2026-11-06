import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class ParentHomeScreen extends StatefulWidget {
  const ParentHomeScreen({super.key});

  @override
  State<ParentHomeScreen> createState() => _ParentHomeScreenState();
}

class _ParentHomeScreenState extends State<ParentHomeScreen> {
  int _currentIndex = 0;

  // Selected child (Sibling support from Project Plan Section 2.3)
  final List<Map<String, String>> _children = [
    {
      "name": "Aarav Sharma",
      "class": "Class 10 - Sec A",
      "roll": "101",
      "admNo": "ADM-2023-1001",
      "todayStatus": "Present",
      "time": "08:15 AM",
    },
    {
      "name": "Ananya Sharma",
      "class": "Class 6 - Sec B",
      "roll": "204",
      "admNo": "ADM-2025-6012",
      "todayStatus": "Present",
      "time": "08:20 AM",
    },
  ];

  int _selectedChildIndex = 0;

  void _showChildSwitchBottomSheet() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(20),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  const Text(
                    "Switch Child / बच्चा बदलें",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF05574F),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  )
                ],
              ),
              const SizedBox(height: 10),
              ...List.generate(_children.length, (index) {
                final child = _children[index];
                final isSelected = _selectedChildIndex == index;
                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  decoration: BoxDecoration(
                    color: isSelected ? const Color(0xFFE8F5E9) : const Color(0xFFF9F9F9),
                    border: Border.all(
                      color: isSelected ? const Color(0xFF05574F) : Colors.grey.shade300,
                      width: isSelected ? 2 : 1,
                    ),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: const Color(0xFF05574F),
                      child: Text(
                        child["name"]![0],
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                    ),
                    title: Text(
                      child["name"]!,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                    subtitle: Text("${child["class"]} • Roll: ${child["roll"]}"),
                    trailing: isSelected
                        ? const Icon(Icons.check_circle, color: Color(0xFF05574F))
                        : null,
                    onTap: () {
                      setState(() {
                        _selectedChildIndex = index;
                      });
                      Navigator.pop(context);
                    },
                  ),
                );
              }),
              const SizedBox(height: 10),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final activeChild = _children[_selectedChildIndex];
    final String formattedDate = DateFormat('EEE, d MMM yyyy').format(DateTime.now());

    // 12 Services matching Project Plan Section 3
    final List<Map<String, dynamic>> services = [
      {
        "title": "Attendance",
        "icon": Icons.calendar_today_rounded,
        "bg": const Color(0xFFE8F5E9),
        "color": const Color(0xFF2E7D32),
      },
      {
        "title": "Fees",
        "icon": Icons.account_balance_wallet_rounded,
        "bg": const Color(0xFFFFF3E0),
        "color": const Color(0xFFE65100),
      },
      {
        "title": "Results",
        "icon": Icons.emoji_events_rounded,
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
        "title": "Notice",
        "icon": Icons.campaign_rounded,
        "bg": const Color(0xFFFFEBEE),
        "color": const Color(0xFFC62828),
      },
      {
        "title": "Leave",
        "icon": Icons.event_busy_rounded,
        "bg": const Color(0xFFF3E5F5),
        "color": const Color(0xFF7B1FA2),
      },
      {
        "title": "Time Table",
        "icon": Icons.access_time_rounded,
        "bg": const Color(0xFFE0F2F1),
        "color": const Color(0xFF00695C),
      },
      {
        "title": "Bus Track",
        "icon": Icons.directions_bus_rounded,
        "bg": const Color(0xFFFFF8E1),
        "color": const Color(0xFFF57F17),
      },
      {
        "title": "Messages",
        "icon": Icons.chat_bubble_outline_rounded,
        "bg": const Color(0xFFE0F7FA),
        "color": const Color(0xFF00838F),
      },
      {
        "title": "Gallery",
        "icon": Icons.photo_library_rounded,
        "bg": const Color(0xFFFCE4EC),
        "color": const Color(0xFFAD1457),
      },
      {
        "title": "Remarks",
        "icon": Icons.rate_review_rounded,
        "bg": const Color(0xFFF1F8E9),
        "color": const Color(0xFF558B2F),
      },
      {
        "title": "Holiday/Events",
        "icon": Icons.celebration_rounded,
        "bg": const Color(0xFFFFFDE7),
        "color": const Color(0xFFF9A825),
      },
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF4F6F8),
      body: Stack(
        children: [
          // 1. TOP DARK GREEN HEADER (#05574F)
          Container(
            height: 250,
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
                // Top Row: Greetings & Icons
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
                            child: Text(
                              activeChild["name"]![0],
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF05574F),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  "Hi, ${activeChild["name"]!.split(' ')[0]}",
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                const Icon(Icons.verified, color: Color(0xFFFDBE3E), size: 16),
                              ],
                            ),
                            const Text(
                              "St. Xavier's International Academy",
                              style: TextStyle(
                                fontSize: 11,
                                color: Color(0xFFB2DFDB),
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    // Action Icons (Bell & Logout)
                    Row(
                      children: [
                        Stack(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.notifications_none, color: Colors.white, size: 26),
                              onPressed: () {},
                            ),
                            Positioned(
                              right: 12,
                              top: 12,
                              child: Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(
                                  color: Color(0xFFFDBE3E),
                                  shape: BoxShape.circle,
                                ),
                              ),
                            )
                          ],
                        ),
                        IconButton(
                          icon: const Icon(Icons.settings_outlined, color: Colors.white, size: 24),
                          onPressed: () {},
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Good Morning & Date Subheader
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.wb_sunny_rounded, color: Color(0xFFFDBE3E), size: 18),
                        const SizedBox(width: 6),
                        const Text(
                          "Good Morning, Parents",
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.white70,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                    Text(
                      formattedDate,
                      style: const TextStyle(
                        fontSize: 12,
                        color: Color(0xFFB2DFDB),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // 2. SCROLLABLE BODY WITH WHITE ROUNDED CARD & 3-COLUMN GRID
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.only(top: 135, left: 16, right: 16, bottom: 90),
              child: Column(
                children: [
                  // Core Flow Banner: Instant Attendance Status Alert
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.06),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: const Color(0xFFE8F5E9),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(
                            Icons.check_circle_rounded,
                            color: Color(0xFF2E7D32),
                            size: 26,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "${activeChild["name"]} is marked ${activeChild["todayStatus"]}",
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                  color: Color(0xFF05574F),
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                "School Attendance submitted at ${activeChild["time"]}",
                                style: TextStyle(
                                  fontSize: 11,
                                  color: Colors.grey.shade600,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFF2E7D32),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Text(
                            "LIVE",
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        )
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // 3-COLUMN ICON GRID IN WHITE ROUNDED CARD (Design Guide Section 3)
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
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            const Text(
                              "School Services",
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF05574F),
                              ),
                            ),
                            Text(
                              activeChild["class"]!,
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey.shade600,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // 3-Column Grid
                        GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollIris(),
                          itemCount: services.length,
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 3,
                            crossAxisSpacing: 12,
                            mainAxisSpacing: 18,
                            childAspectRatio: 0.88,
                          ),
                          itemBuilder: (context, index) {
                            final item = services[index];
                            return InkWell(
                              onTap: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text("Opening ${item["title"]} for ${activeChild["name"]}"),
                                    duration: const Duration(seconds: 1),
                                    backgroundColor: const Color(0xFF05574F),
                                  ),
                                );
                              },
                              borderRadius: BorderRadius.circular(16),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  // Colorful Round Icon
                                  Container(
                                    width: 54,
                                    height: 54,
                                    decoration: BoxDecoration(
                                      color: item["bg"],
                                      shape: BoxShape.circle,
                                    ),
                                    child: Icon(
                                      item["icon"],
                                      color: item["color"],
                                      size: 26,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  // Label Text
                                  Text(
                                    item["title"],
                                    textAlign: TextAlign.center,
                                    style: const TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF263238),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Recent Circular / Diary Quick Preview
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: const [
                            Text(
                              "Latest Notice / Circular",
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                                color: Color(0xFF05574F),
                              ),
                            ),
                            Text(
                              "Nov 08",
                              style: TextStyle(fontSize: 12, color: Colors.grey),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          "Parent-Teacher Meeting (PTM) for Term 1 Results will be held on Saturday from 8:30 AM to 1:00 PM.",
                          style: TextStyle(fontSize: 12, color: Color(0xFF455A64), height: 1.4),
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

      // 3. BOTTOM NAV BAR WITH CENTER BIG YELLOW BUTTON (#FDBE3E) FOR "CHILD SWITCH"
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 20,
              offset: const Offset(0, -4),
            )
          ],
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
                icon: Icon(
                  Icons.home_rounded,
                  color: _currentIndex == 0 ? const Color(0xFF05574F) : Colors.grey.shade400,
                  size: 28,
                ),
                onPressed: () => setState(() => _currentIndex = 0),
              ),
              IconButton(
                icon: Icon(
                  Icons.group_outlined,
                  color: _currentIndex == 1 ? const Color(0xFF05574F) : Colors.grey.shade400,
                  size: 28,
                ),
                onPressed: () => setState(() => _currentIndex = 1),
              ),
              const SizedBox(width: 48), // Space for center floating button
              IconButton(
                icon: Icon(
                  Icons.bar_chart_rounded,
                  color: _currentIndex == 3 ? const Color(0xFF05574F) : Colors.grey.shade400,
                  size: 28,
                ),
                onPressed: () => setState(() => _currentIndex = 3),
              ),
              IconButton(
                icon: Icon(
                  Icons.person_outline_rounded,
                  color: _currentIndex == 4 ? const Color(0xFF05574F) : Colors.grey.shade400,
                  size: 28,
                ),
                onPressed: () => setState(() => _currentIndex = 4),
              ),
            ],
          ),
        ),
      ),

      // Center Big Yellow Floating Action Button (#FDBE3E)
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: FloatingActionButton(
        elevation: 6,
        backgroundColor: const Color(0xFFFDBE3E), // Design Guide Yellow (#FDBE3E)
        shape: const CircleBorder(),
        onPressed: _showChildSwitchBottomSheet,
        tooltip: "Switch Child / बच्चा बदलें",
        child: const Icon(
          Icons.swap_horiz_rounded,
          color: Color(0xFF05574F),
          size: 32,
        ),
      ),
    );
  }
}
