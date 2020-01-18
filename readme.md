在一般的Redux应用中,
  对应一个State的改变你需要写Action,
  Reducer和Sagas等很模板代码,
  而很多State之间的行为又很类似,
  有大量的代码重复;

我们能不能让Reducer变得聪明一些, 从type中读出我们的意图, 直接返回出我们想要的State变化;

首先这就需要我们对type进行一个约定: pathA.pathB.pathC@method
比如 a.b.c@set 就相当于 value => ({a: b: {c: value}})
同一个reducer就能对有所state的Set Action进行正确反馈了
这样的reducer可以写成一个reducer字典

这样大多数的Action\Reducer就可以在创建Store的时刻完成
但是还有一些action需要除了payload和state以外额外的信息(比如initialValue)
而且如果payload比较复杂, 我们希望能给payload添加默认值, 并且会被新ActionCreator传递的args覆盖
所以就要在解析状态声明的时候添加, 通过修改解析方法就会生成注入后的自定义化的Action

接下来的问题是这样的话相当于action和State绑定了, 
如果需要改变多个State就必须dispatch很多Action
这样会导致频繁的re-render, 并且也不利于分析状态变化
而且set, reset, increment也不符合Action作为Event的命名规则

所以, 我们希望能让Reducer能直接将一些简单Action组合起来成为一个复杂Action
我们约定对于: 
{
  type: 'namespace@complexAction',
  actions: [
    {type: 'person.firstName@set', payload: 'hello'},
    {type: 'person.lastName@set', payload: 'world'},
  ]
}
Reducer会无视type的内容, 而是会对actions里面的每一个子action依次进行递归处理
然后再将其结果作为新的State返回出去, 每个子Action也可以是一个复杂Action

另一个需要处理的问题是异步事件的问题, 比起RootSaga模式我们希望能以更小的颗粒度处理每一个Task的生命周期
于是, 对于ajax, 我们不采用take的方法, 而是用新的middleware将已知的异步Action拦截下来
在这个middleware里创建Saga Task就可以保存起来, 为了区分还可以从action中传入id,
这样就可以在store.injectedSaga数组中准确得找到某一类task并取消

具体代码类似:

```
// 和Container对应的标识符
const namespace = 'test';
// StateRecipe数组, 用来定义这个namespace下面的所有状态
// 具有深度的对象可以使用'.'来连接path
const recipes: Array<StateRecipe> = [
  { path: 'firstName', initialValue: 'John' },
  { path: 'lastName', initialValue: 'Doe' },
  {
    path: 'fullName',
    initialValue: 'John Doe',
    otherProps: {
      request: { method: 'get', url: 'api/user/12345/fullname' }, // default axios request config
      mode: 'takeLast', // asynchronous action mode
      callbacks: {
        onRequestAction: { type: 'test.fullName@set', payload: 'Loading' }
      }
    }
  },
  { path: 'a', initialValue: {} },
  { path: 'a.sampleList', initialValue: [] },
  { path: 'a.sampleList2', initialValue: [] }
];

// 解析StateRecipes, 得到一个actionCreator树和初始化状态 
const namespaceData = createNamespaceBundle(namespace, recipes);
const { actions, preloadedState } = namespaceData;
// 一个简单的工具方法能直接从actions里获取actionCreator
const getActionCreator = createActionCreatorGetter(actions);

// 演示如何创建一个事件, 事件可以看为Action的组合
const setBothName = (firstName: string, lastName: string): Action => {
  return {
    type: `${namespace}@setFullName`,
    actions: [
      getActionCreator('firstName', 'set')(firstName),
      getActionCreator('lastName', 'set')(lastName)
    ]
  };
};

// Container组件
export const Component: React.FunctionComponent = () => {
  // 初始化Container下的状态, 只在第一次加载Container时触发
  useInjectState(namespace, preloadedState);

  // 工具方法, 节省写Action和Selector的完整路径的时间
  // 也可以导入其他Container的namespace和actions来跨namespace访问资源
  const dispatch = useAdvancedDispatch(actions);
  // 默认是get方法, 在Selector字典中可以添加通用Selector
  const select = useAdvancedSelector(namespace);
  return (
    <>
      <div>Personal Info</div>
      {/* 简单的Selector的使用, 实际上是从test.firstname获取的 */}
      <div>{`${select('firstName')} ${select('lastName')}`}</div>
      <div>{`${select('fullName')}`}</div>
      {/* 简单的Selector的使用, 实际上是从test.firstname获取的 */}
      <div>
        {/* 通过路径+方法名调用简单action */}
        <button onClick={dispatch('firstName', 'set', 'Harry')}>
          Set firstName to Harry
        </button>
        {/* 也可以直接dispatch一个action */}
        <button onClick={dispatch(setBothName('Harry', 'Potter'))}>
          Set name to Harry Potter
        </button>
        {/* 异步Action, 可以覆写一些在Recipe里定义的配置 */}
        <button
          onClick={dispatch(
            'fullName',
            'request',
            {},
            {
              successAction: getActionCreator('firstName', 'set')(),
              errorAction: getActionCreator('firstName', 'set')(),
              cancelAction: getActionCreator('firstName', 'set')()
            }
          )}
        >
          Request fullName
        </button>
      </div>
    </>
  );
};

// 导出这个namespace里的资源和方法给其他Namespace调用
export const accessor = {
  namespace,
  namespaceData,
  getActionCreator
};
```