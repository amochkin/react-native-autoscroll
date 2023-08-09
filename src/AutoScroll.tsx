import React, { useRef, useState, useEffect, PropsWithChildren } from 'react';
import { ScrollView, ScrollViewProps, View } from 'react-native';
import { NativeScrollEvent } from 'react-native/Libraries/Components/ScrollView/ScrollView';
import { LayoutChangeEvent, NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';

type ScrollDirection = 'up' | 'down' | 'both';

interface AutoScrollProps extends ScrollViewProps {
  /** Scroll direction.
   * Direction means `"down"` is simple scrolling down, `"up"` scrolls from bottom to top, `"both"` infinitely scrolls down and up
   * @default 'both' */
  scrollDirection?: ScrollDirection;
  /** Sensitivity threshold to trigger the reach of boundaries of the scroll contents.
   * @default 0 */
  offsetThreshold?: number;
  /** The delay between scroll events.
   * @default 200 */
  delay?: number;
  /** The step of the scroll.
   * @default 5 */
  step?: number;
  /** Callback when the scroll is finished, only fires for scrollDirection `up` and `down` */
  onScrollFinish?: () => void;
  /** Callback when the scroll position changes */
  onScrollPosition?: (position: number) => void;
  /** Callback when the scroll direction changes, only fires for scrollDirection `both` */
  onScrollChangeDirection?: (direction: ScrollDirection) => void;
  /** Callback when the content height changes */
  onContentHeightChange?: (height: number) => void;
}

/**
 * This component will automatically scroll its contents.
 * It is useful for scrolling credits, lyrics, etc.
 * It can scroll infinitely `both` up and down, or just `up` or `down`.
 * @param props AutoScrollProps
 * @constructor
 */

export const AutoScroll: React.FC<PropsWithChildren<AutoScrollProps>> = ({
  scrollDirection = 'both',
  offsetThreshold = 0,
  delay = 200,
  step = 5,
  onScrollFinish,
  onScrollPosition,
  onScrollChangeDirection,
  onContentHeightChange,
  children,
  ...inheritedProps
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [direction, setDirection] = useState<ScrollDirection>(scrollDirection === 'both' ? 'down' : scrollDirection);
  const [position, setPosition] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  /** Scroll to position if position dep is changed */
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: position, animated: true });
    onScrollPosition?.(position);
  }, [onScrollPosition, position]);

  /** Monitor content height */
  useEffect(() => {
    onContentHeightChange?.(contentHeight);
  }, [contentHeight, onContentHeightChange]);

  /** Initialize timer to scroll */
  useEffect(() => {
    if (!isFinished) {
      const timer = setTimeout(() => {
        if (direction === 'up') {
          setPosition(value => Math.max(offsetThreshold, value - step));
        } else if (direction === 'down') {
          setPosition(value => Math.min(contentHeight - offsetThreshold, value + step));
        }
      }, delay);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [direction, delay, step, contentHeight, position, offsetThreshold, isFinished]);

  useEffect(() => {
    if (isFinished) {
      onScrollFinish?.();
    }
  }, [isFinished, onScrollFinish]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // We use floor and ceil because currentPosition is float and moving slowly to target value,
    // thus getting scroll stuck for a while
    const currentPosition =
      direction === 'down'
        ? Math.ceil(event.nativeEvent.contentOffset.y)
        : Math.floor(event.nativeEvent.contentOffset.y);
    const innerHeight = event.nativeEvent.contentSize.height;
    const parentHeight = event.nativeEvent.layoutMeasurement.height;
    const maxOffset = innerHeight - parentHeight - offsetThreshold;
    setContentHeight(innerHeight);

    if (scrollDirection === 'both') {
      if (currentPosition <= offsetThreshold && direction === 'up') {
        setDirection('down');
        onScrollChangeDirection?.('down');
      } else if (currentPosition >= maxOffset && direction === 'down') {
        setDirection('up');
        onScrollChangeDirection?.('up');
      }
    } else {
      if (direction === 'down' && currentPosition >= maxOffset) {
        setIsFinished(true);
      } else if (direction === 'up' && currentPosition <= offsetThreshold) {
        setIsFinished(true);
      }
    }
  };

  // We use inner layout to get the height of the content before first scrolling event is triggered;
  // It is relevant only for scrollDirection 'up', but it is also useful to update the contentHeight anyway
  const handleInnerLayout = (event: LayoutChangeEvent) => {
    const innerHeight = event.nativeEvent.layout.height;
    setContentHeight(innerHeight);
    if (scrollDirection === 'up') {
      setPosition(innerHeight);
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEnabled={true}
      scrollEventThrottle={delay}
      decelerationRate={'fast'}
      {...inheritedProps}>
      <View onLayout={handleInnerLayout}>{children}</View>
    </ScrollView>
  );
};
