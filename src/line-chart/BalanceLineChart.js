import * as array from 'd3-array'
import * as shape from 'd3-shape'
import * as scale from 'd3-scale'
import Chart from '../chart/chart'
import {View} from "react-native"
import Svg from "react-native-svg"
import React from "react"
import PropTypes from 'prop-types'
import Path from "react-native-svg-charts/src/animated-path"


export default class BalanceLineChart extends Chart {
  calcIndexes() {
    const {data} = this.props
    return data.map((_, index) => index)
  }

  // read BarChart.calcXScale for more information
  calcXScale(domain) {
    const {
      contentInset: { left = 0, right = 0 },
      spacingInner,
      spacingOuter,
    } = this.props

    const { width } = this.state

    return scale
        .scaleBand()
        .domain(domain)
        .range([left, width - right])
        .paddingInner([spacingInner])
        .paddingOuter([spacingOuter])
  }

  createPaths({data, x, y, spacing}) {
    const {curve} = this.props

    const line = shape
        .line()
        .x((d) => {
          return x(d.x) + spacing
        })
        .y((d) => y(d.y))
        .defined((item) => typeof item.y === 'number')
        .curve(curve)(data)

    return {
      path: line,
      line,
    }
  }

  render() {
    const {
      data,
      xAccessor,
      yAccessor,
      yScale,
      style,
      animate,
      animationDuration,
      numberOfTicks,
      contentInset: { top = 0, bottom = 0 },
      gridMax,
      gridMin,
      clampY,
      svg,
      children,
    } = this.props

    const {width, height} = this.state

    if (data.length === 0) {
      return <View style={style} />
    }

    const mappedData = data.map((item, index) => ({
      y: yAccessor({ item, index }),
      x: xAccessor({ item, index }),
    }))

    const yValues = mappedData.map((item) => item.y)

    const yExtent = array.extent([...yValues, gridMin, gridMax])

    const { yMin = yExtent[0], yMax = yExtent[1] } = this.props

    //invert range to support svg coordinate system
    const y = yScale()
        .domain([yMin, yMax])
        .range([height - bottom, top])
        .clamp(clampY)

    // [aspire] [balance line] [cash flow chart]
    const x = this.calcXScale(this.calcIndexes())
    const bandwidth = x.bandwidth()
    const spacing = bandwidth / 2.8

    const paths = this.createPaths({
      data: mappedData,
      x,
      y,
      spacing
    })

    const ticks = y.ticks(numberOfTicks)

    const extraProps = {
      x,
      y,
      data,
      ticks,
      width,
      height,
      spacing,
      bandwidth,
      ...paths,
    }

    return (
        <View pointerEvents='box-none' style={style}>
          <View style={{flex: 1}}
                pointerEvents='box-none'
                onLayout={(event) => this._onLayout(event)}>
            {height > 0 && width > 0 && (
                <Svg style={{height, width}}>
                  {React.Children.map(children, (child) => {
                    if (child && child.props.belowChart) {
                      return React.cloneElement(child, extraProps)
                    }
                    return null
                  })}
                  <Path
                      fill={'none'}
                      {...svg}
                      d={paths.path}
                      animate={animate}
                      animationDuration={animationDuration}
                  />
                  {React.Children.map(children, (child) => {
                    if (child && !child.props.belowChart) {
                      return React.cloneElement(child, extraProps)
                    }
                    return null
                  })}
                </Svg>
            )}
          </View>
        </View>
    )
  }
}

BalanceLineChart.propTypes = {
  ...Chart.propTypes,
  spacingInner: PropTypes.number,
  spacingOuter: PropTypes.number,
}

BalanceLineChart.defaultProps = {
  ...Chart.defaultProps,
}
