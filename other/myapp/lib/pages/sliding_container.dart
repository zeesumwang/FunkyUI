import 'package:myapp/components/sliding_card.dart';
import 'package:flutter/material.dart';

class SlidingContainer extends StatefulWidget {
  final List movies;

  const SlidingContainer({Key? key, required this.movies}) : super(key: key);

  @override
  _SlidingContainerState createState() => _SlidingContainerState();
}

class _SlidingContainerState extends State<SlidingContainer> {
  late PageController pageController;
  double pageOffset = 0;

  @override
  void initState() {
    super.initState();
    pageController = PageController(viewportFraction: 0.84);
    pageController.addListener(() {
      setState(() => pageOffset = pageController.page!);
    });
  }

  @override
  void dispose() {
    pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: MediaQuery.of(context).size.height * 0.9,
      child: PageView(
        controller: pageController,
        children: List.generate(widget.movies.length, (index) {
          return SlidingCard(
            onPressed: () => {print(index)},
            movie: widget.movies[index],
            offset: pageOffset - index,
          );
        }),
      ),
    );
  }
}
