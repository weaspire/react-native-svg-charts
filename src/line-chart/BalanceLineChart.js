import * as array from 'd3-array'
import * as shape from 'd3-shape'
import * as scale from 'd3-scale'
import Chart from '../chart/chart'
import {View} from "react-native"
import Svg from "react-native-svg"
import React from "react"
import Path from "react-native-svg-charts/src/animated-path"


class BalanceLineChart extends Chart {
  calcIndexes() {
    const {data} = this.props
    return data.map((_, index) => index)
  }

  createPaths({data, x, y, barWidth}) {
    const {curve} = this.props

    const line = shape
        .line()
        .x((d) => {
          return x(d.x) + barWidth
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
      xScale,
      style,
      animate,
      animationDuration,
      numberOfTicks,
      contentInset: { top = 0, bottom = 0, left = 0, right = 0 },
      gridMax,
      gridMin,
      clampX,
      clampY,
      svg,
      children,
    } = this.props

    const { width, height } = this.state

    if (data.length === 0) {
      return <View style={style} />
    }

    const mappedData = data.map((item, index) => ({
      y: yAccessor({ item, index }),
      x: xAccessor({ item, index }),
    }))

    const yValues = mappedData.map((item) => item.y)
    const xValues = mappedData.map((item) => item.x)

    const yExtent = array.extent([...yValues, gridMin, gridMax])
    const xExtent = array.extent([...xValues])

    const { yMin = yExtent[0], yMax = yExtent[1], xMin = xExtent[0], xMax = xExtent[1] } = this.props

    //invert range to support svg coordinate system
    const y = yScale()
        .domain([yMin, yMax])
        .range([height - bottom, top])
        .clamp(clampY)

    // [aspire] [balance line] [cash flow chart]
    const x = scale
        .scaleBand()
        .domain(this.calcIndexes())
        .range([left, width - right])
        .paddingInner([0.05])
        .paddingOuter([0.05])

    // [aspire] [balance line] [cash flow chart]
    const barWidth = x.bandwidth() / 2.8

    const paths = this.createPaths({
      data: mappedData,
      x,
      y,
      barWidth
    })

    const ticks = y.ticks(numberOfTicks)

    const extraProps = {
      x,
      y,
      data,
      ticks,
      width,
      height,
      barWidth,
      ...paths,
    }

    return (
        <View style={style}>
          <View style={{ flex: 1 }} onLayout={(event) => this._onLayout(event)}>
            {height > 0 && width > 0 && (
                <Svg style={{ height, width }}>
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
}

BalanceLineChart.defaultProps = {
  ...Chart.defaultProps,
}

export default BalanceLineChart
