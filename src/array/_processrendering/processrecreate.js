import initMK from '../../_core/init';
import renderItemNode from './renderitemnode';
import triggerOne from '../../trigger/_triggerone';
import defs from '../../_core/defs';
import checkAlreadyRendered from './checkalreadyrendered';
import matreshkaError from '../../_helpers/matreshkaerror';
import getAlreadyRendered from './getalreadyrendered';

// this function renders inserted items if possible when recreate method is called
export default function processRecreate({
    self,
    selfDef,
    eventOptions,
    container
}) {
    const { added, removed, silent } = eventOptions;
    const { id: selfId } = selfDef;

    // iterate over removed items and remove their nodes
    nofn.forEach(removed, item => {
        const itemDef = defs.get(item);

        if (itemDef) {
            const { renderedInArrays } = itemDef;
            const node = renderedInArrays && renderedInArrays[selfId];
            if (node) {
                delete itemDef.renderedInArrays[selfId];
                container.removeChild(node);
            }
        }
    });

    const alreadyRenderedMap = {};

    // iterate over all items
    // the following approach allows to throw an error when two added objects are the same
    // (not only compare existing items with old ones)
    nofn.forEach(self, item => {
        if (item && typeof item === 'object') {
            const itemDef = defs.get(item);
            const node = getAlreadyRendered({
                item,
                selfDef
            });

            if (node) {
                // if an item is already rendered (old item)
                if (itemDef.id in alreadyRenderedMap) {
                    // if an item is rendered twice throw an error
                    throw matreshkaError('array:add_render_twice');
                }

                alreadyRenderedMap[itemDef.id] = true;

                container.appendChild(node);
            } else {
                // this is newly added item
                const { node, itemEventOptions } = renderItemNode({
                    selfDef,
                    self,
                    item,
                    eventOptions
                });

                if (node) {
                    if (itemDef.id in alreadyRenderedMap) {
                        // if newly added item is rendered twice throw an error
                        throw matreshkaError('array:add_render_twice');
                    }

                    alreadyRenderedMap[itemDef.id] = true;

                    container.appendChild(node);

                    if (!silent) {
                        triggerOne(item, 'afterrender', itemEventOptions);
                    }
                }
            }
        }
    });
}