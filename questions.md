Q: What is the difference between Component and PureComponent? give an
example where it might break my app.
A: Unlike Component, PureComponent doesn't rerender when it's parent rerenders if the props are the same as before. This is used as a performance optimization but it can actually make things worse because of unnecessary equality checks.

Q: Context + ShouldComponentUpdate might be dangerous. Can think of why is
that?
A: I assume that there can be a situation where we expect a child component to re-render because the context has changed but the parent component doesn't re-render because of ShouldComponentUpdate, therefore blocking the child render. I never saw such a case though, mainly because in the projects I worked on context wasn't used that much, mainly to pass down few providers (think of Theme object for example) and that's it. Proper state management such as redux/mobx was used instead.

Q: Describe 3 ways to pass information from a component to its PARENT.
A: I would say callbacks passed down from parent to child and state management (flux/redux/mobx). Doesn't sound like you need to do this often with good architecture though, as technically things like this are against the React principles (unidirectional data flow).

Q: Give 2 ways to prevent components from re-rendering.
A: 1) PureComponent / React.memo, 2) ShouldComponentUpdate for class components, 3) avoid unnecessary state / props changes (avoid needless state variables, use useCallback / useMemo for things that are passed down as props when reasonable)

Q: What is a fragment and why do we need it? Give an example where it might
break my app.
A: It's a container that doesn't in fact render so it's preferable to use fragments instead of empty divs to avoid increasing DOM complexity. I don't think they can break the app, but I would assume they can potentially break the styling.

Q: Give 3 examples of the HOC pattern.
A: The aforementioned React.memo, withTranslation HOC from i18n, old style redux (withDispatch etc)

Q: what's the difference in handling exceptions in promises, callbacks and
async...await.
A. Okay so I don't think anyone uses callbacks for async stuff these days, so I'm not sure about that. Even when I started back in 2016 there were promises. Polyfilled, but they were.
With classic promises you have .catch(reason) to catch the promise rejection. With async/await you have to check the response with checks like if (response.data) {}. Some libraries like react-query abstract that quite a bit further

Q: How many arguments does setState take and why is it async.
A: I feel like this questionnaire is a little bit outdated. I believe you can pass a callback instead of an object there to have more granular control over what's updated and how. It's async because it might queue the updates, therefore it's not guaranteed that the change will happen right after it's called.

Q: List the steps needed to migrate a Class to Function Component.
A: Honestly, I usually copy-paste the component, change `class implements Component` to the function signature, see the IDE going mad and then change part by part. `render()` to `return()`, remove the public / private modifiers, replace state with useState, lifecycle hooks with useEffect. Sometimes I also split the component into smaller components because legacy class components tend to contain too much stuff inside - like inner functions that return parts of JSX etc and it works terribly in terms of performance for function components.

Q: List a few ways styles can be used with components.
A: Classic (.css / scss / whatever) file imported into a component, then you have CSS-in-JS things like StyledComponents / styled() from material-ui (hate it because of runtime overhead), then you have helper libraries like Tailwind, and obviously you can still use `style` prop on stuff but it's obviously not the best way of doing things because it kills all the selector priority thing.

Q: How to render an HTML string coming from the server.
A: There is a thing called dangerouslySetInnerHTML which I luckily never needed to use :)
