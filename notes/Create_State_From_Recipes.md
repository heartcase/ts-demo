由配置生成的Redux状态管理

状态结构:  

```
RootState
{
  [key]: NameSpace
}

NameSpace
{
  [key]: StateValue
}
```  

直接从StateValue映射Action和Reducer
```
Actions
{
  set(x) => {type: `${namespace}.${key}.set`, value: x},
  reset() => {type: `${namespace}.${key}.reset`}
  ....
}

Reducer
switch(action.type) {
  case [namespace].[key].set: return (action.value)
  case [namespace].[key].reset: return (initialValue)
  ...
}
```

由StateRecipes数组直接生成NameSpace

```
const recipes: Array<StateRecipes> = [
  { key: 'firstName', initialValue: 'John' },
  { key: 'lastName', initialValue: 'Doe' },
  {
    key: 'fullName',
    initialValue: 'John Doe',
    actions: requestAction,
    otherProps: {
      request: { method: 'get', url: 'api/user/12345/fullname' }
    }
  }
];
const namespaceData = buildNameSpace({ namespace, recipes });
```
