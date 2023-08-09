import React from 'react';
import 'react-native';
/* Note: test renderer must be required after react-native */
import * as renderer from 'react-test-renderer';
import AutoScroll from '../src';

/**
 * Tests for a component
 */

console.debug('React.version', React.version);

test('renders correctly', () => {
	renderer.create(<AutoScroll />);
});
