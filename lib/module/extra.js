import React from 'react'
import { G } from 'react-native-svg'

const Extra = ({ children, ...props }) => {
    return /*#__PURE__*/ React.createElement(
        G,
        null,
        React.Children.map(children, (child) => {
            return /*#__PURE__*/ React.cloneElement(child, props)
        })
    )
}

export default Extra
//# sourceMappingURL=extra.js.map
