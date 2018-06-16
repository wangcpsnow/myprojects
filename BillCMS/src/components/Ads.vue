<template>
    <div class="ads">
        <el-carousel>
            <el-carousel-item v-for="item in imgs" :key="item.id">
                <img :src="item.imagePath" alt="">
                <a href="">删除</a>
            </el-carousel-item>
        </el-carousel>
        <el-form label-width="100px">
            <el-form-item label="选择图片">
                <el-input type='file' v-model='uploadForm.image' class='uploadFile'></el-input>
            </el-form-item>
            <el-form-item label="跳转链接">
                <el-input size='medium' v-model='uploadForm.imageUrl'></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click='clickAddImg'>添加图片</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
// import $ from "jquery";

export default {
    data() {
        return {
            imgs: [],
            uploadForm: {
                image: '',
                imageUrl: ''
            }
        }
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.$http.get('/ild/admin/manage/queryImage')
                .then(res => {
                    this.imgs = res.data.data;
                });
        },
        clickAddImg() {
            if (!this.uploadForm.image) {
                this.$toast('', '请选择图片', 'warning');
                return;
            }
            if (!this.uploadForm.imageUrl) {
                this.$toast('', '请选择图片跳转链接', 'warning');
                return;
            }
            // var param = new FormData();
            // var oFile = document.getElementsByClassName('uploadFile')[0].getElementsByTagName('input');
            // param.append('image', oFile, 'image');
            // param.append('imageUrl', this.uploadForm.imageUrl);
            // this.$http.post('/ild/admin/manage/uploadImage', param, {
            //         headers: {'Content-Type': 'multipart/form-data'}
            //     })
            //     .then(res => {});

            // $.ajax({
            //     url: '/ild/admin/manage/uploadImage',
            //     type: 'POST',
            //     data: $(".ads form").serialize(),
            //     success: function () {}
            // });
        }
    }
}
</script>

<style lang='stylus' scoped>
    .ads {
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
    }
</style>