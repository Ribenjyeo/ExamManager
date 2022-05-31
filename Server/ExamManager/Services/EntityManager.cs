using System.Collections.ObjectModel;
using System.Reflection;

namespace ExamManager.Services;

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

    public ModifyManager<TEntity> Modify<TEntity>(TEntity entity)
    {
        return new(entity);
    }

    public class CopyManager<T>
    {
        private T _target { get; set; }
        public CopyManager(T target)
        {
            _target = target;
        }

        /// <summary>
        /// Копирование значений свойств из <i>source</i>
        /// </summary>
        /// <param name="source">Объект, значения свойств которого будут скопированы</param>
        public CopyManager<T> AllPropertiesFrom(T source)
        {
            var properties = typeof(T).GetProperties();
            foreach (var property in properties)
            {
                property.SetValue(_target, property.GetValue(source));
            }

            return this;
        }

        /// <summary>
        /// Присвоить значение свойству
        /// </summary>
        /// <param name="propertyName">Название свойства</param>
        /// <param name="value">Присваиваемое значение</param>
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
                targetPropertyName = (string?)attribute
                    .NamedArguments
                    .FirstOrDefault(arg => arg.MemberName.Equals(nameof(MapPropertyNameAttribute.PropertyName)))
                    .TypedValue
                    .Value;
            }

            return targetPropertyName ?? string.Empty;
        }
    
    }

    public class ModifyManager<TEntity>
    {
        TEntity _entity { get; set; }

        public ModifyManager(TEntity entity)
        {
            _entity = entity;
        }

        public ModifyManager<TEntity> BasedOn(TEntity baseEntity)
        {
            var properties = baseEntity.GetType().GetProperties();

            foreach(var property in properties)
            {
                var value = property.GetValue(baseEntity);
                if (value is not null)
                {
                    property.SetValue(_entity, value);
                }
            }

            return this;
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