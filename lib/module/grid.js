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
import PropTypes from 'prop-types'
import { G, Line } from 'react-native-svg'

const Horizontal = ({ ticks = [], y, svg }) => {
    return /*#__PURE__*/ React.createElement(
        G,
        null,
        ticks.map((tick) =>
            /*#__PURE__*/ React.createElement(
                Line,
                _extends(
                    {
                        key: tick,
                        x1: '0%',
                        x2: '100%',
                        y1: y(tick),
                        y2: y(tick),
                        strokeWidth: 1,
                        stroke: 'rgba(0,0,0,0.2)',
                    },
                    svg
                )
            )
        )
    )
}

const Vertical = ({ ticks = [], x, svg }) => {
    return /*#__PURE__*/ React.createElement(
        G,
        null,
        ticks.map((tick, index) =>
            /*#__PURE__*/ React.createElement(
                Line,
                _extends(
                    {
                        key: index,
                        y1: '0%',
                        y2: '100%',
                        x1: x(tick),
                        x2: x(tick),
                        strokeWidth: 1,
                        stroke: 'rgba(0,0,0,0.2)',
                    },
                    svg
                )
            )
        )
    )
}

const Both = (props) => {
    return /*#__PURE__*/ React.createElement(
        G,
        null,
        /*#__PURE__*/ React.createElement(Horizontal, props),
        /*#__PURE__*/ React.createElement(Vertical, props)
    )
}

Vertical.propTypes = {
    x: PropTypes.func,
    dataPoints: PropTypes.array,
    svg: PropTypes.object,
}
Horizontal.propTypes = {
    y: PropTypes.func,
    ticks: PropTypes.array,
}
Both.propTypes = { ...Vertical.propTypes, ...Horizontal.propTypes }
const Direction = {
    VERTICAL: 'VERTICAL',
    HORIZONTAL: 'HORIZONTAL',
    BOTH: 'BOTH',
}

const Grid = ({ direction, ...props }) => {
    if (direction === Direction.VERTICAL) {
        return /*#__PURE__*/ React.createElement(Vertical, props)
    } else if (direction === Direction.HORIZONTAL) {
        return /*#__PURE__*/ React.createElement(Horizontal, props)
    } else if (direction === Direction.BOTH) {
        return /*#__PURE__*/ React.createElement(Both, props)
    }

    return null
}

Grid.Direction = Direction
Grid.propTypes = {
    direction: PropTypes.oneOf(Object.values(Direction)),
    belowChart: PropTypes.bool,
    svg: PropTypes.object,
}
Grid.defaultProps = {
    direction: Direction.HORIZONTAL,
    belowChart: true,
}
export default Grid
//# sourceMappingURL=grid.js.map
