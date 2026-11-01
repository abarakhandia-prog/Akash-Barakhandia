import React, { useState } from 'react';
import {
  X,
  Code2,
  Copy,
  Check,
  Download,
  FileCode,
  FolderGit2,
  Terminal,
} from 'lucide-react';

export const FlutterSourceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeFile, setActiveFile] = useState<string>('pubspec.yaml');
  const [copied, setCopied] = useState(false);

  const flutterFiles: Record<string, { label: string; code: string }> = {
    'pubspec.yaml': {
      label: 'pubspec.yaml',
      code: `name: my_education_sathi
description: "My Education Sathi - India's Smart Education App"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  # Core Network & Storage
  http: ^1.2.0
  shared_preferences: ^2.2.2
  cached_network_image: ^3.3.1
  # Payment Gateway
  razorpay_flutter: ^1.3.7
  # PDF & Video
  flutter_pdfview: ^1.3.2
  video_player: ^2.8.2
  chewie: ^1.7.4
  # Firebase Core & Messaging
  firebase_core: ^2.27.0
  firebase_auth: ^4.17.8
  cloud_firestore: ^4.15.8
  firebase_messaging: ^14.7.19
  # State Management & Icons
  provider: ^6.1.1
  lucide_icons: ^0.257.0
  google_fonts: ^6.1.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/icons/`,
    },

    'main.dart': {
      label: 'lib/main.dart',
      code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'screens/home_screen.dart';
import 'screens/courses_screen.dart';
import 'screens/mock_test_screen.dart';
import 'screens/chat_screen.dart';
import 'screens/profile_screen.dart';
import 'providers/app_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AppProvider()),
      ],
      child: const MyEducationSathiApp(),
    ),
  );
}

class MyEducationSathiApp extends StatelessWidget {
  const MyEducationSathiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My Education Sathi',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1D4ED8), // Royal Blue
          primary: const Color(0xFF1D4ED8),
          secondary: const Color(0xFFEA580C), // Accent Orange
        ),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(),
      ),
      home: const MainTabScaffold(),
    );
  }
}

class MainTabScaffold extends StatefulWidget {
  const MainTabScaffold({super.key});

  @override
  State<MainTabScaffold> createState() => _MainTabScaffoldState();
}

class _MainTabScaffoldState extends State<MainTabScaffold> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    CoursesScreen(),
    MockTestScreen(),
    ChatScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() => _currentIndex = index);
        },
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.menu_book_outlined), selectedIcon: Icon(Icons.menu_book), label: 'Courses'),
          NavigationDestination(icon: Icon(Icons.assignment_outlined), selectedIcon: Icon(Icons.assignment), label: 'Mock Tests'),
          NavigationDestination(icon: Icon(Icons.chat_bubble_outline), selectedIcon: Icon(Icons.chat_bubble), label: 'Chat'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}`,
    },

    'razorpay_service.dart': {
      label: 'lib/services/razorpay_service.dart',
      code: `import 'package:flutter/material.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class RazorpayService {
  late Razorpay _razorpay;
  final Function(PaymentSuccessResponse) onSuccess;
  final Function(PaymentFailureResponse) onFailure;

  RazorpayService({required this.onSuccess, required this.onFailure}) {
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, onSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, onFailure);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    debugPrint('External Wallet Selected: \${response.walletName}');
  }

  Future<void> openCheckout({
    required String planId,
    required String planName,
    required double amount,
    required String studentEmail,
    required String studentName,
  }) async {
    // 1. Create order on secure backend server
    final response = await http.post(
      Uri.parse('https://your-api-domain.com/api/payment/create-order'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'planId': planId,
        'planName': planName,
        'amount': amount,
        'studentEmail': studentEmail,
        'studentName': studentName,
      }),
    );

    final data = jsonDecode(response.body);

    var options = {
      'key': data['key'],
      'amount': data['amount'], // in paise
      'name': 'My Education Sathi',
      'description': planName,
      'order_id': data['orderId'],
      'prefill': {
        'contact': '+91 9437123456',
        'email': studentEmail,
      },
      'theme': {
        'color': '#1D4ED8',
      }
    };

    try {
      _razorpay.open(options);
    } catch (e) {
      debugPrint('Razorpay checkout error: \$e');
    }
  }

  void dispose() {
    _razorpay.clear();
  }
}`,
    },

    'AndroidManifest.xml': {
      label: 'android/app/src/main/AndroidManifest.xml',
      code: `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.myeducationsathi.app">

    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.WAKE_LOCK"/>
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>

    <application
        android:label="My Education Sathi"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:usesCleartextTraffic="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">

            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>

            <!-- Razorpay UPI Intent Filter -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="upi" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
    },

    'build_instructions.md': {
      label: 'Android_Build_Instructions.md',
      code: `# MY EDUCATION SATHI - FLUTTER & ANDROID BUILD GUIDE

## 1. Prerequisites
- Flutter SDK (3.24.0 or higher)
- Android Studio with Android SDK (API 34)
- Java Development Kit (JDK 17)

## 2. Setup Project
\`\`\`bash
# 1. Clone repository
git clone https://github.com/myeducationsathi/app.git
cd my_education_sathi

# 2. Install Flutter dependencies
flutter pub get

# 3. Add Google Services JSON
# Download google-services.json from Firebase Console
# Place inside android/app/google-services.json
\`\`\`

## 3. Generate Android APK
\`\`\`bash
# Build universal Release APK:
flutter build apk --release

# Build split APKs for smaller file size (~14MB per device architecture):
flutter build apk --release --split-per-abi
\`\`\`

Binary output will be saved at:
\`build/app/outputs/flutter-apk/app-armeabi-v7a-release.apk\`
\`build/app/outputs/flutter-apk/app-arm64-v8a-release.apk\`

## 4. Google Play Store App Bundle (AAB)
\`\`\`bash
flutter build appbundle --release
\`\`\`
Output: \`build/app/outputs/bundle/release/app-release.aab\``,
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(flutterFiles[activeFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-5xl h-[92vh] bg-slate-900 text-slate-100 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Complete Flutter & Android Source Repository
              </h3>
              <p className="text-xs text-slate-400">
                Cross-platform mobile application codebase ready for compile & deployment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* File Navigator + Code Viewer */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
          {/* File sidebar */}
          <div className="w-full sm:w-60 bg-slate-950 border-r border-slate-800 p-3 space-y-1 overflow-y-auto shrink-0 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1 block">
              Project Structure
            </span>
            {Object.keys(flutterFiles).map((filename) => (
              <button
                key={filename}
                onClick={() => setActiveFile(filename)}
                className={`w-full text-left px-3 py-2 rounded-lg font-mono flex items-center gap-2 transition-all ${
                  activeFile === filename
                    ? 'bg-blue-600/30 text-blue-300 font-semibold border border-blue-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <FileCode className="w-4 h-4 shrink-0 text-slate-500" />
                <span className="truncate">{filename}</span>
              </button>
            ))}
          </div>

          {/* Main Code Window */}
          <div className="flex-1 bg-black p-4 sm:p-6 overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed">
            <div className="text-[11px] text-slate-500 mb-2 pb-2 border-b border-slate-900 flex justify-between">
              <span>{flutterFiles[activeFile].label}</span>
              <span>UTF-8</span>
            </div>
            <pre className="whitespace-pre-wrap">{flutterFiles[activeFile].code}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
