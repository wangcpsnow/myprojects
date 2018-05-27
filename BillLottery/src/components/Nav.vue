<template>
    <div class="nav">
        <table>
            <tr>
                <td :class='{active: activeType=="enter"}'><a href="/entry.html">发票录入</a></td>
                <td :class='{active: activeType=="query"}'><a href="/query.html">中奖查询</a></td>
                <td><a href="javascript:void(0)">直播与回顾</a></td>
                <td><a href="javascript:void(0)">公告信息</a></td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    props: ['activeType'],
    methods: {
        handleClick(tab, event) {
            console.log(arguments);
        }
    }
}
</script>

<style lang="stylus" scoped>
    .nav {
        table {
            width: 100%;
            border-collapse:collapse;
        }
        td {
            border: 1px solid silver;
            text-align: center;
            padding: 6px 0;
            background: #B5CFEA;
            a {
                color: #2c3e50;
            }
        }
        td.active {
            background: #F7C1AA;
        }
    }
</style>