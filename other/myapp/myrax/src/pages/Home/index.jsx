/* eslint-disable no-console */
import { createElement } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
// import Slider from 'rax-slider';

import styles from './index.module.css';

import Logo from '@/components/Logo';

export default function Home() {
  onchange = (index) => {
    console.log('change', index);
  };
  return (
    <View className={styles.homeContainer}>
      <Slider
        className="slider"
        width="750px"
        height="500px"
        style={styles.slider}
        paginationStyle={styles.paginationStyle}
        autoplayTimeout={3000}
      >
        <Slider.Item>
          <Logo uri="//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png" />
          <Text className={styles.homeTitle}>Welcome to Your Rax App</Text>
          <Text className={styles.homeInfo}>More information about Rax</Text>
          <Text className={styles.homeInfo}>Visit https://rax.js.org</Text>
        </Slider.Item>
        <Slider.Item>
          <Logo uri="//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png" />
          <Text className={styles.homeTitle}>Welcome to Your Rax App</Text>
          <Text className={styles.homeInfo}>More information about Rax</Text>
          <Text className={styles.homeInfo}>Visit https://rax.js.org</Text>
        </Slider.Item>
      </Slider>
      <Logo uri="//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png" />
      <Text className={styles.homeTitle}>Welcome to Your Rax App</Text>
      <Text className={styles.homeInfo}>More information about Rax</Text>
      <Text className={styles.homeInfo}>Visit https://rax.js.org</Text>
    </View>
  );
}
