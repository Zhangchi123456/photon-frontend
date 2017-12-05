import * as React from 'react';

type Props = {
    title: string,
    selectedItems: string[],
    allItems: string[],
    onChange: (selectedItems: string[]) => void
};

export class MultiPicker extends React.Component<Props> {

    toggleItem = (item: string) => {
        const { onChange } = this.props;
        let selectedItems: string[] = [...this.props.selectedItems];
        let index = selectedItems.findIndex(selectedItem => selectedItem === item);
        if (index === -1) {
            // 之前没有选中，将其选中
            selectedItems.push(item);
        } else {
            // 已选中的，取消选中
            selectedItems.splice(index, 1);
        }
        onChange(selectedItems);
    }

    render() {
        const { allItems, selectedItems, title } = this.props;
        return (
            <div>
                <label>{title}：</label>
                {allItems.map(item =>
                    <span
                        key={item}
                        onClick={() => this.toggleItem(item)}
                        className={selectedItems.find(selecteditem => selecteditem === item) ? 'selected' : ''}
                    >{item}
                    </span>)}
            </div>
        );
    }
}