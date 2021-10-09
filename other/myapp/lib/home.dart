import 'package:flutter/material.dart';
import 'package:myapp/pages/sliding_container.dart';
// import 'package:myapp/pages/profile.dart';
import 'package:kraken/kraken.dart';
import 'package:kraken/widget.dart';
import 'package:myapp/models/movie.dart';
import 'dart:typed_data';
import 'dart:ui' as ui;
import 'package:flutter/rendering.dart';

void defineKrakenCustomElements() {
  Kraken.defineCustomElement('flutter-text', (Map<String, dynamic> attributes) {
    return Text(attributes['value'] ?? '',
        textDirection: TextDirection.ltr,
        style: TextStyle(color: Color.fromARGB(255, 100, 100, 100)));
  });
}

/// This is the stateful widget that the main application instantiates.
class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePage();
}

class _HomePage extends State<HomePage> {
  int _selectedIndex = 0;
  GlobalKey rootWidgetKey = GlobalKey();
  List<Movie> movies = [];

  Future<ByteData?> _capturePngToByteData() async {
    try {
      RenderRepaintBoundary boundary = rootWidgetKey.currentContext!
          .findRenderObject() as RenderRepaintBoundary;
      if (boundary.debugNeedsPaint) {
        // 等待动画结束后再进行截图
        await Future.delayed(const Duration(milliseconds: 20));
        return _capturePngToByteData();
      }
      ui.Image image =
          await boundary.toImage(pixelRatio: ui.window.devicePixelRatio);
      ByteData? _byteData =
          await image.toByteData(format: ui.ImageByteFormat.png);
      Uint8List pngBytes = _byteData!.buffer.asUint8List();
      Movie movie = Movie(
        name: '怒火・重案',
        intro: '重案组布网围剿国际毒枭，突然杀出一组蒙面悍匪 '
            '“黑吃黑”，更冷血屠杀众警察。重案组督察张崇邦（甄子丹 饰）亲睹战友被杀，深入追查发现，悍匪首领竟是昔日战友邱刚敖（谢霆锋 饰）。',
        poster: pngBytes,
        date: '2021-07-30',
        price: '19.99',
      );
      movies.add(movie);
      setState(() {});
      return _byteData;
    } catch (e) {
      print(e);
    }
    return null;
  }

  void _onItemTapped(int index) {
    print(index);
    if (index == 0) {
      this._capturePngToByteData();
    }
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  void initState() {
    super.initState();
    defineKrakenCustomElements();
  }

  @override
  Widget build(BuildContext context) {
    // Kraken mainPage = Kraken(
    //   bundlePath: 'hello-vue/dist/js/test.js',
    // );
    SlidingContainer mainPage = SlidingContainer(
      movies: movies,
    );
    Scaffold home = Scaffold(
      body: SafeArea(child: mainPage),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home_max_sharp),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.image_search_sharp),
            label: 'Business',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.pink[300],
        onTap: _onItemTapped,
      ),
    );
    return RepaintBoundary(
      key: rootWidgetKey,
      child: home,
    );
  }
}
