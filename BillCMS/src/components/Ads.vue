<template>
    <div class="ads">
        <!-- <el-carousel>
            <el-carousel-item v-for="item in imgs" :key="item.id">
                <img :src="item.imagePath" alt="">
                <a href="javascript:void(0);" class='dele' @click='clickDele(item.id)'>删除</a>
            </el-carousel-item>
        </el-carousel> -->
        <h2 class="title">广告图片管理列表</h2>
        <div class="tableWrap">
            <el-table :data='imgs' border style="width: 100%">
                <el-table-column label='图片展示'>
                    <template slot-scope="scope">
                        <img :src="scope.row.imagePath" width='100px' alt="">
                    </template>
                </el-table-column>
                <el-table-column prop='imageUrl' label='跳转链接'></el-table-column>
                <el-table-column label='上传时间' width='160'>
                    <template slot-scope="scope">{{scope.row.createTime | parseTime}}</template>
                </el-table-column>
                <el-table-column label='操作' width='120'>
                    <template slot-scope="scope">
                        <el-button type='danger' @click="clickDele(scope.row.id)" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <h2 class="title">上传新图片</h2>
        <el-form label-width="100px">
            <el-form-item label="选择图片">
                <el-input type='file' size='medium' class='uploadFile' @change='changeUpFile'></el-input>
            </el-form-item>
            <el-form-item label="跳转链接">
                <el-input size='medium' class='goUrl'></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click='clickAddImg' size='medium'>添加图片</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import $ from 'jquery';

export default {
    data() {
        return {
            imgs: []
            // uploadForm: {
            //     image: '',
            //     imageUrl: ''
            // }
        }
    },
    created() {
        this.getData();
    },
    filters: {
        parseTime(timestamp, fmt = 'yyyy-MM-dd hh:mm:ss') {
            var self = new Date(timestamp);
            var o = {
                'M+': self.getMonth() + 1,
                'd+': self.getDate(),
                'h+': self.getHours(),
                'm+': self.getMinutes(),
                's+': self.getSeconds(),
                'q+': Math.floor((self.getMonth() + 3) / 3),
                'S': self.getMilliseconds()
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (self.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
                }
            }
            return fmt;
        }
    },
    watch: {
        // 'uploadForm.image'(newVal) {
            // var reg = /jpg$/gi;
            // if (newVal) {
            //     if (!reg.test(newVal)) {
            //         this.$toast('', '只能上传jpg图片', 'warning');
            //         document.getElementsByClassName('uploadFile')[0].getElementsByTagName('input')[0].value = '';
            //         this.uploadForm.image = '';
            //         return;
            //     }
            // }
        // }
    },
    methods: {
        // 获取之前的图片数据
        getData() {
            this.$http.get('/ild/admin/manage/queryImage')
                .then(res => {
                    this.imgs = res.data.data;
                });
        },
        // 改变文件检测文件类型
        changeUpFile() {
            var $file = $('.uploadFile input[type="file"]');
            if (!$file.val().trim()) {
                return;
            }
            var reg = /jpg$/gi;
            if (!reg.test($file.val().trim())) {
                this.$toast('', '只能上传jpg图片', 'warning');
                $file.val('');
            }
        },
        // 确认添加
        clickAddImg() {
            var $file = $('.uploadFile input[type="file"]');
            if (!$file.val().trim()) {
                this.$toast('', '请选择图片', 'warning');
                return;
            }
            var $url = $('.goUrl input[type="text"]');
            if (!$url.val().trim()) {
                this.$toast('', '请选择图片跳转链接', 'warning');
                return;
            }
            var param = new FormData();
            param.append('image', $file[0].files[0]);
            param.append('imageUrl', $url.val().trim());
            this.$http.post('/ild/admin/manage/uploadImage', param)
                .then(res => {
                    if (res.data && res.data.data) {
                        this.getData();
                        // this.uploadForm.image = '';
                        // this.uploadForm.imageUrl = '';
                        this.$toast('', '上传成功');
                        $url.val('');
                        $file.val('');
                    }
                    else {
                        this.$toast('', res.data.errMsg, 'warning');
                    }
                });
        },
        clickDele(id) {
            this.$http.get('/ild/admin/manage/deleteImage?id=' + id)
                .then(res => {
                    if (res.data.ret && res.data.data) {
                        this.$toast('', '删除成功');
                        this.getData();
                    }
                });
        }
    }
}
</script>

<style lang='stylus' scoped>
    .ads {
        .title {
            margin: 0 0 10px 10px;
            font-size: 18px;
            border-bottom: 1px solid silver;
        }
        .el-carousel {
            width: 400px;
            img {
                width: 400px;
            }
        }
        .el-form {
            margin-top: 20px;
            width: 500px;
        }
        .el-carousel__item {
            .dele {
                position: relative;
                color: red;
                font-weight: bold;
                left: 100px;
                bottom: 50px;
            }
        }
        .tableWrap {
            padding: 10px;
        }
    }
</style>