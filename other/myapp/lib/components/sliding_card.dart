import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'package:myapp/models/movie.dart';

class SlidingCard extends StatelessWidget {
  /// 动画过程偏移量
  final double offset;

  /// 电影模型
  final Movie movie;

  final VoidCallback onPressed;

  SlidingCard({
    Key? key,
    required this.movie,
    required this.offset,
    required this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    double gauss = math.exp(-(math.pow((offset.abs() - 0.5), 2) / 0.08));
    return Transform.translate(
        offset: Offset(-32 * gauss * offset.sign, 0),
        child: InkWell(
          onTap: onPressed,
          splashColor: Colors.pink[200],
          borderRadius: BorderRadius.all(Radius.circular(32.0)),
          child: Container(
            // margin: EdgeInsets.only(left: 8, right: 8, bottom: 24),
            // elevation: 8,
            // shape: RoundedRectangleBorder(
            //   borderRadius: BorderRadius.circular(32),
            // ),
            child: Column(
              children: <Widget>[
                ClipRRect(
                  borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
                  child: Image.memory(
                    movie.poster,
                    height: MediaQuery.of(context).size.height * 0.8,
                    alignment: Alignment(-offset.abs(), 0),
                    fit: BoxFit.scaleDown,
                  ),
                ),
                // SizedBox(height: 8),
                // Expanded(
                //   child: Padding(
                //     padding: const EdgeInsets.all(8.0),
                //     child: Column(
                //       crossAxisAlignment: CrossAxisAlignment.start,
                //       children: <Widget>[
                //         Text('${movie.name}',
                //             style: TextStyle(
                //               fontSize: 20,
                //               fontWeight: FontWeight.w500,
                //             )),
                //         SizedBox(height: 8),
                //         Text('上映日期: ${movie.date}',
                //             style: TextStyle(
                //               color: Colors.grey,
                //             )),
                //         Text(
                //           '${movie.intro}',
                //           maxLines: 2,
                //           overflow: TextOverflow.ellipsis,
                //           style: TextStyle(color: Colors.grey),
                //         ),
                //         Spacer(),
                //         Row(
                //           children: <Widget>[
                //             MaterialButton(
                //               color: Color(0xFF162A49),
                //               child: Text('立即购买'),
                //               textColor: Colors.white,
                //               shape: RoundedRectangleBorder(
                //                 borderRadius: BorderRadius.circular(32),
                //               ),
                //               onPressed: () {},
                //             ),
                //             Spacer(),
                //             Text(
                //               '￥${movie.price}',
                //               style: TextStyle(
                //                 fontWeight: FontWeight.bold,
                //                 fontSize: 20,
                //               ),
                //             ),
                //             SizedBox(width: 16),
                //           ],
                //         )
                //       ],
                //     ),
                //   ),
                // ),
              ],
            ),
          ),
        ));
  }
}
