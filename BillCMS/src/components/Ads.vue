<template>
    <div class="ads">
        <el-carousel>
            <el-carousel-item v-for="item in imgs" :key="item.id">
                <img :src="item.imagePath" alt="">
                <a href="javascript:void(0);" class='dele' @click='clickDele(item.id)'>删除</a>
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
            var param = new FormData();
            var oFile = document.getElementsByClassName('uploadFile')[0].getElementsByTagName('input')[0];
            param.append('image', oFile.files[0]);
            param.append('imageUrl', this.uploadForm.imageUrl);
            this.$http.post('/ild/admin/manage/uploadImage', param)
                .then(res => {
                    if (res.data && res.data.data) {
                        this.getData();
                        this.uploadForm.image = '';
                        this.uploadForm.imageUrl = '';
                        this.$toast('', '上传成功');
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
    }
</style>