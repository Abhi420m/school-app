import 'package:flutter/material.dart';
import 'screens/parent_home_screen.dart';

void main() {
  runApp(const SchoolParentApp());
}

class SchoolParentApp extends StatelessWidget {
  const SchoolParentApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'School Parent App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF4F6F8),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF05574F), // Dark Green Header Theme
          primary: const Color(0xFF05574F),
          secondary: const Color(0xFFFDBE3E), // Yellow Accent Button
        ),
        fontFamily: 'Roboto',
      ),
      home: const ParentHomeScreen(),
    );
  }
}
