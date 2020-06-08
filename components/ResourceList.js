import {
  Card,
  ResourceList,
  Stack,
  TextStyle,
  Thumbnail,
} from '@shopify/polaris';

const ResourceListComponent = (props) => {
    const {itemList,handleSelectedProduct,selectedItems} = props
    console.log(itemList);
//   static contextType = Context;

    // const app = this.context;
    // const redirectToProduct = () => {
    //   const redirect = Redirect.create(app);
    //   redirect.dispatch(
    //     Redirect.Action.APP,
    //     '/edit-products',
    //   );
    // };

    const twoWeeksFromNow = new Date(Date.now() + 12096e5).toDateString();
    return (
      <>

          {/* if (loading) { return <div>Loading…</div>; }
          if (error) { return <div>{error.message}</div>; } */}
            <Card>
              <ResourceList
                showHeader
                resourceName={{ singular: 'Product', plural: 'Products' }}
                items={itemList}
                selectedItems={selectedItems}
                onSelectionChange={handleSelectedProduct}
                selectable
                renderItem={(item) => {
                //   const media = (
                //     <Thumbnail`
                //       source={
                //         item`````````````````````````````````````````````.images.edges[0]
                //           ? item.images.edges[0].node.originalSrc
                //           : ''
                //       }
                //       alt={
                //         item.images.edges[0]
                //           ? item.images.edges[0].node.altText
                //           : ''
                //       }
                //     />
                //   );
                  const price = item.variants.price;
                  return (
                    <ResourceList.Item
                      id={item.id}
                      selectable
                    //   media={media}
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
                          <p>{item.price}</p>
                        </Stack.Item>
                        <Stack.Item>
                          <p>Expires on {twoWeeksFromNow} </p>
                        </Stack.Item>
                      </Stack>
                    </ResourceList.Item>
                  );
                }}
              />
            </Card>
      </>
    );
  }


export default ResourceListComponent;
