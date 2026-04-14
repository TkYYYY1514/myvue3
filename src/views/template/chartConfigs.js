export const chartConfigs = {
    //1.柱状图
    bar:{
        titleText:'柱状图',
        option:{
            title:{
                text:'柱状图',
                left:'center',
                textStyle:{
                    color: '#666',
                    fontWeight: 700,  
                },
            },
            grid: {
                left: '5%',
                right: '5%',
                top: '15%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五']
              },
            yAxis: { type: 'value' },
            series: [
                {
                  type: 'bar',
                  data: [120, 200, 150, 80, 250]
                }
              ]
            }
        }
    }
    
