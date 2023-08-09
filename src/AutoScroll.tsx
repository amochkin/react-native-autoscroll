import React, { useRef, useState, PropsWithChildren } from 'react';
import { ScrollView, ScrollViewProps, View } from 'react-native';
import { NativeScrollEvent } from 'react-native/Libraries/Components/ScrollView/ScrollView';
import { LayoutChangeEvent, NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';

type ScrollDirection = 'up' | 'down' | 'both';

interface AutoScrollProps extends ScrollViewProps {
	/** Scroll direction.
	 * Direction means `"down"` is simple scrolling down, `"up"` scrolls from bottom to top, `"both"` infinitely scrolls down and up
	 * @default "both" */
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
// eslint-disable @typescript-eslint/no-unused-vars
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

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {};

	const handleInnerLayout = (event: LayoutChangeEvent) => {};

	return (
		<ScrollView
			ref={scrollViewRef}
			onScroll={handleScroll}
			scrollEnabled={true}
			scrollEventThrottle={delay}
			decelerationRate={'fast'}
			{...inheritedProps}
		>
			<View onLayout={handleInnerLayout}>{children}</View>
		</ScrollView>
	);
};
