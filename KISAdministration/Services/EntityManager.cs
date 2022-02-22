using System.Collections.ObjectModel;
using System.Reflection;

namespace KISAdministration.Services;

public class EntityManager
{
    public CopyManager<T> CopyInto<T>(T target)
    {
        return new(target);
    }

    public MappingManager<TSource, TTarget> Map<TSource, TTarget>()
    {
        return new();
    }

    public class CopyManager<T>
    {
        private T _target { get; set; }
        public CopyManager(T target)
        {
            _target = target;
        }

        public CopyManager<T> AllPropertiesFrom(T source)
        {
            var properties = typeof(T).GetProperties();
            foreach (var property in properties)
            {
                property.SetValue(_target, property.GetValue(source));
            }

            return this;
        }

        public CopyManager<T> Property(string propertyName, object value)
        {
            typeof(T).GetProperty(propertyName)?.SetValue(_target, value);

            return this;
        }

        public T GetResult()
        {
            return _target;
        }
    }

    public class MappingManager<TSource, TTarget>
    {
        private Type _sourceType { get; set; }
        private Type _targetType { get; set; }
        public MappingManager()
        {
            _sourceType = typeof(TSource);
            _targetType = typeof(TTarget);
        }

        public string PropertyName(string propertyName)
        {
            var attributeType = typeof(MapPropertyNameAttribute);

            var attribute = typeof(TSource).GetProperty(propertyName)?
                .CustomAttributes
                .FirstOrDefault(attrData =>
                {
                    // Данный атрибут необходимого нам типа
                    var result = attrData.AttributeType.Equals(attributeType);
                    if (result)
                    {
                        var attributeTargetClass = attrData.NamedArguments.FirstOrDefault(arg => arg.MemberName.Equals(nameof(MapPropertyNameAttribute.ForClass))).TypedValue.Value;
                        var targetClass = _targetType;
                            // Значения поля ForClass совпадают
                            result = result && attributeTargetClass!.Equals(targetClass);
                    }
                    return result;
                });

            var targetPropertyName = string.Empty;

            if (attribute is null)
            {
                targetPropertyName = propertyName;
            }
            else
            {
                targetPropertyName = (string)attribute.NamedArguments.FirstOrDefault(arg => arg.MemberName.Equals(nameof(MapPropertyNameAttribute.PropertyName))).TypedValue.Value;
            }

            return string.IsNullOrEmpty(targetPropertyName) ? string.Empty : targetPropertyName;
        }
    
    }

    [AttributeUsage(AttributeTargets.Property, AllowMultiple = true)]
    public class MapPropertyNameAttribute : Attribute
    {
        public Type ForClass { get; set; }
        public string PropertyName { get; set; }
        public MapPropertyNameAttribute()
        { }
    }
}

public struct Property
{
    public string Name { get; set; }
    public object Value { get; set; }
}