function _extends() {
    _extends =
        Object.assign ||
        function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i]
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key]
                    }
                }
            }
            return target
        }
    return _extends.apply(this, arguments)
}

import React from 'react'
import { Line } from 'react-native-svg'

class HorizontalLine extends React.Component {
    render() {
        const { y, value, ...other } = this.props
        return /*#__PURE__*/ React.createElement(
            Line,
            _extends(
                {
                    x1: '0%',
                    x2: '100%',
                    y1: y(value),
                    y2: y(value),
                },
                other
            )
        )
    }
}

HorizontalLine.defaultProps = {
    stroke: 'black',
}
export default HorizontalLine
//# sourceMappingURL=horizontal-line.js.map
