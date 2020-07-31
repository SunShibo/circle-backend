<template>
    <div class="table"
         v-loading="loading2" element-loading-text="拼命加载中" element-loading-background="rgba(255, 255, 255, 0.8)"
         element-loading-spinner="el-icon-loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades">统计图表</i>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                时间:
                <el-date-picker
                        :clearable="clearable"
                        v-model="value7"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy/MM/dd"
                        value-format="yyyy/MM/dd"
                >
                </el-date-picker>
                单位：
                <el-select v-model="type" style="margin-right:10px;width:100px;">
                    <el-option
                            v-for="item in unit"
                            :key="item.key"
                            :label="item.key"
                            :value="item.value"
                    ></el-option>
                </el-select>

                <el-button type="primary" icon="search" @click="_search" style="margin-left: 10px">搜索</el-button>
            </div>
            <div class="chart-list">
                <div ref="chartModel" class="chart"></div>
                <div ref="chartActive"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'statistics',
        data() {
            return {
                loading2: true,
                potionModel: {
                    title: {
                        text: '用户匹配情况',
                        x: 'center',
                        y: 'top',
                    },
                    series: [
                        {
                            name: '数据',
                            type: 'pie',
                            radius: '55%',
                            data: [
                                {value: 0, name: 'DATE模式匹配(0)'},
                                {value: 0, name: 'RIEND模式匹配(0)'},
                                {value: 0, name: 'CAR模式匹配(0)'},
                            ]
                        }
                    ],


                },
                optionActive: {
                    title: {
                        text: '用户活跃情况',
                    },
                    legend: {
                        data: ['日活跃', '新注册', '总用户']
                    },
                    xAxis: {
                        type: 'category',
                        data: []
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '新注册',
                            type: 'line',
                            data: []
                        },
                        {
                            name: '日活跃',
                            type: 'line',
                            data: []
                        },
                    ],
                    tooltip: {
                        //鼠标悬停提示内容
                        trigger: 'axis', // 触发类型，默认数据触发，可选为：'axis' item
                        axisPointer: {
                            // 坐标轴指示器，坐标轴触发有效
                            type: "line", // 默认为直线，可选为：'line' | 'shadow'
                            label: 'cross',
                            show: true
                        },
                    },
                },
                type: 'day',
                value7: '',
                unit: [{key: '日', value: 'day'}, {key: '月', value: 'month'}, {key: '年', value: 'year'}],
                clearable: false,
            };
        },
        created() {
            let d = new Date();
            this.value7 = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
            this.getData();
        },
        methods: {
            drawLine() {
                let chartModel = this.$echarts.init(this.$refs.chartModel);
                chartModel.setOption(this.potionModel);
                let chartActive = this.$echarts.init(this.$refs.chartActive);
                chartActive.setOption(this.optionActive);
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.loading2 = true;
                this.potionModel.series[0].data = [];
                this.optionActive.xAxis.data = [];
                this.optionActive.series[0].data = [];
                this.optionActive.series[1].data = [];

                this.$axios
                    .post("/Statistical/getStatistical", {
                        date: this.value7,
                        type: this.type,
                    })
                    .then(res => {
                        this.potionModel.series[0].data.push({
                            name: 'DATE模式匹配(' + res.data.date + ')',
                            value: res.data.date
                        });
                        this.potionModel.series[0].data.push({
                            name: 'FRIEND模式匹配(' + res.data.friend + ')',
                            value: res.data.friend
                        });
                        this.potionModel.series[0].data.push({
                            name: 'CAR模式匹配(' + res.data.car + ')',
                            value: res.data.car
                        });
                        this.optionActive.xAxis.data = res.data.dayList;
                        if (res.data.registeredCount != null && res.data.registeredCount.length > 0) {
                            for (let i = 0; i < res.data.registeredCount.length; i++) {
                                this.optionActive.series[0].data.push(res.data.registeredCount[i].value);
                            }
                        }
                        if (res.data.activeCountList != null && res.data.activeCountList.length > 0) {
                            for (let i = 0; i < res.data.activeCountList.length; i++) {
                                this.optionActive.series[1].data.push(res.data.activeCountList[i].value);
                            }
                        }
                        this.drawLine();
                        this.loading2 = false;
                    });

            },
            _search() {
                this.getData();
            },
        }, mounted() {
            this.drawLine();
        }

    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .chart {
        flex-basis: 45%;
        width: 100%;
        height: 200px;
    }

    .chart-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .chart-list > div:last-child {
        flex: 1 1 auto;
        width: 100%;
        height: 400px;
    }

</style>
