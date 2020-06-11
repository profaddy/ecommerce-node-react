import {
  Card,
  ResourceList,
  ResourceItem,
  Stack,
  TextStyle,
  Thumbnail,
} from '@shopify/polaris';

const ResourceListComponent = (props) => {
    const {itemList,handleSelectedProduct,selectedItems} = props;
    const emptyStateMarkup = () => {
      return (
        <EmptyState heading="Upload a file to get started" />
      );
    }
    const twoWeeksFromNow = new Date(Date.now() + 12096e5).toDateString();
    return (
      <>
            <Card>
              <ResourceList
                showHeader
                resourceName={{ singular: 'Product', plural: 'Products' }}
                items={itemList}
                selectedItems={selectedItems}
                onSelectionChange={handleSelectedProduct}
                selectable
                emptyState={emptyStateMarkup}
                renderItem={(item) => {
                  // const media = (
                  //   <Thumbnail`
                  //     source={
                  //       item.images
                  //         ? item.images.originalSrc
                  //         : ''
                  //     }
                  //     alt={
                  //       item.images
                  //         ? item.images.altText
                  //         : ''
                  //     }
                  //   />
                  // )
                  const price = item.variants.price;
                  return (
                    <ResourceItem
                      id={item.id}
                      // media={media}
                      accessibilityLabel={`View details for ${item.title}`}
                    >
                      <Stack>
                        <Stack.Item fill>
                          <h3>
                            <TextStyle variation="strong">
                              {item.title}
                            </TextStyle>
                          </h3>
                        </Stack.Item>
                        <Stack.Item>
                          <p>{item.variants[0].price}</p>
                        </Stack.Item>
                        <Stack.Item>
                          <p>Expires on {twoWeeksFromNow} </p>
                        </Stack.Item>
                      </Stack>
                    </ResourceItem>
                  );
                }}
              />
            </Card>
      </>
    );
  }


export default ResourceListComponent;
