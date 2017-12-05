import * as React from 'react';
import { Post, Region, RouterProps } from '../../global/models';
import { ImageUploader } from '../ImageUploader/ImageUploader';
import { MultiPicker } from '../MultiPicker/MultiPicker';
import { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';

export type StateProps = {
    post: Post,
    allCostOptions: string[],
    allRegions: Region[],  // 所有地区
    allTags: string[],
    provinces: Region[]
};

export type OwnProps = {
    onSubmit: (post: Post) => Promise<any>,
    title: '发布约拍信息' | '修改约拍信息'
};

type PostEditComponentProps = StateProps & OwnProps & RouterProps;

class PostEdit extends React.Component<PostEditComponentProps, {
    requiredRegionCode: number,
    selectedProvinceCode: number,
    photoUrls: string[],
    costOption: string
    cost: number,
    content: string,
    tags: string[]
}> {

    constructor(props: PostEditComponentProps) {
        super(props);
        const { photoUrls, requiredRegionCode, costOption, cost, content, tags } = props.post;
        this.state = {
            requiredRegionCode,
            selectedProvinceCode: Math.floor(requiredRegionCode / 10000) * 10000,   // 对应省级单位的代码
            photoUrls: [...photoUrls], // 避免改变props，使用浅拷贝
            costOption,
            cost,
            content,
            tags
        };
    }

    handleProvinceChange = (event: ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            selectedProvinceCode: +event.target.selectedOptions[0].value
        });
    }

    handleRegionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            requiredRegionCode: +event.target.selectedOptions[0].value
        });
    }

    handleCostOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            costOption: event.target.value
        });
    }

    handleCostChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            cost: event.target.valueAsNumber
        });
    }

    handleImageUrlsChange = (imageUrls: string[]) => {
        this.setState({
            photoUrls: imageUrls
        });
    }

    handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            content: event.target.value
        });
    }

    handleTagChange = (tags: string[]) => {
        this.setState({ tags });
    }

    handleSubmit = () => {
        let result = { ...this.props.post, ...this.state };
        delete result.selectedProvinceCode;

        const { onSubmit, history } = this.props;
        onSubmit(result as Post).then(() => history!.goBack());
    }

    handleCancel = () => {
        this.props.history!.goBack();
    }

    render() {
        const { allCostOptions, allRegions, allTags, title, provinces } = this.props;
        const { requiredRegionCode, photoUrls, selectedProvinceCode,
            cost, costOption, content, tags } = this.state;

        const provinceCodeStr = selectedProvinceCode.toString().substring(0, 2);
        const subRegions = allRegions.filter(
            region => region.regionCode.toString().search(provinceCodeStr) === 0
        ); // 前两位编码相同

        const shouldInputCost = !!(['需要收费', '愿意付费'].find(value => value === costOption));

        return (
            <section>
                <header>{title}</header>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label data-required>面向地区：</label>
                        <select name="province" required onChange={this.handleProvinceChange}>
                            <option value="" disabled selected={!selectedProvinceCode} hidden>省份</option>
                            {provinces.map(province =>
                                <option
                                    key={province.regionCode}
                                    value={province.regionCode}
                                    selected={province.regionCode === selectedProvinceCode}
                                >{province.regionName}
                                </option>)}
                        </select>
                        <select name="region" required onChange={this.handleRegionChange}>
                            <option value="" disabled selected={!requiredRegionCode} hidden>地区</option>
                            {subRegions && subRegions.map(region =>
                                <option
                                    key={region.regionCode}
                                    value={region.regionCode}
                                    selected={region.regionCode === requiredRegionCode}
                                >{region.regionName}
                                </option>)}
                        </select>
                    </div>
                    <div>
                        <label data-required>约拍费用：</label>
                        {allCostOptions.map(option =>
                            <label key={option}>
                                <input
                                    type="radio"
                                    name="costOption"
                                    defaultChecked={option === costOption}
                                    onChange={this.handleCostOptionChange}
                                    required
                                />
                                {option}
                            </label>)}
                        {shouldInputCost ?
                            <input
                                type="number"
                                name="cost"
                                placeholder="输入金额"
                                value={cost}
                                min={1}
                                onChange={this.handleCostChange}
                                required
                            />
                            : null}
                    </div>
                    <div>
                        <label data-required>发布内容：</label>
                        <textarea
                            name="content"
                            maxLength={100}
                            placeholder="自我介绍，对应征者的要求等（勿留联系方式，发布后，有人应征即可看到对方的联系方式）"
                            onChange={this.handleContentChange}
                            required
                        >{content}
                        </textarea>
                    </div>
                    <MultiPicker
                        allItems={allTags}
                        onChange={this.handleTagChange}
                        selectedItems={tags}
                        title="拍摄标签"
                    />
                    <div>
                        <label>附加照片：</label>
                        <span>您的个人照片或作品，最多9张</span>
                        <ImageUploader
                            initialImageUrls={photoUrls}
                            onImageUrlsChange={this.handleImageUrlsChange}
                        />
                    </div>
                    <input type="submit" value="提交" />
                    <input type="button" value="取消" onClick={this.handleCancel} />
                </form>
            </section >
        );
    }
}

export const PostEditComponent = withRouter(PostEdit);