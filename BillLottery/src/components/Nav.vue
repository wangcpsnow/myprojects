<template>
    <div class="nav">
        <table>
            <tr>
                <td :class='{active: activeType=="enter"}'><a href="/entry.html">发票录入</a></td>
                <td :class='{active: activeType=="query"}'><a href="/query.html">中奖查询</a></td>
                <td><a href="https://vzan.com/live/livedetail-233679?stamp=636583476286167584">直播与回顾</a></td>
                <td><a href="http://weixin.121mai0078.com/index.php?g=Wap&m=Infomation&a=recommend_content&id=240859&token=uxgqhr1483508444">公告信息</a></td>
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